"""
collect_webcam_data.py - Interactive ISL webcam training data collector
=======================================================================
Captures hand landmarks from your webcam using MediaPipe VIDEO mode
(the same mode the browser uses) to bridge the training/inference domain gap.

Usage:
    python collect_webcam_data.py

Controls:
    SPACE  - Capture 60 frames for the current sign (hold the sign still)
    ENTER  - Skip current sign and move to the next
    Q      - Quit early (saves whatever was collected so far)

After all signs are collected the script automatically:
    1. Writes webcam_landmarks.csv
    2. Merges it with the existing landmarks.csv
    3. Asks if you want to retrain
"""

from __future__ import annotations

import csv
import subprocess
import sys
import urllib.request
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python.vision import (
    HandLandmarker,
    HandLandmarkerOptions,
    RunningMode,
)

# -- Config --------------------------------------------------------------------
# Targeted re-collection: only signs that are still inaccurate in real-time
SIGNS: list[str] = ['E','H','J','R','V','Y']
FRAMES_PER_SIGN: int = 100   # more frames for harder signs
WEBCAM_CSV = Path(__file__).with_name("webcam_landmarks.csv")
MERGED_CSV = Path(__file__).with_name("landmarks.csv")
MODEL_PATH = Path(__file__).with_name("hand_landmarker.task")

COL_GREEN  = (0, 220, 100)
COL_RED    = (0, 60, 220)
COL_YELLOW = (0, 210, 255)
COL_WHITE  = (240, 240, 240)
COL_DARK   = (20, 20, 20)

# -- Download MediaPipe model if missing ---------------------------------------
if not MODEL_PATH.exists():
    url = (
        "https://storage.googleapis.com/mediapipe-models/"
        "hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
    )
    print("Downloading MediaPipe hand landmarker model...")
    urllib.request.urlretrieve(url, MODEL_PATH)
    print("Done.\n")

# -- MediaPipe VIDEO mode (same as browser inference) -------------------------
options = HandLandmarkerOptions(
    base_options=mp_python.BaseOptions(model_asset_path=str(MODEL_PATH)),
    running_mode=RunningMode.VIDEO,
    num_hands=2,
    min_hand_detection_confidence=0.5,
    min_hand_presence_confidence=0.5,
    min_tracking_confidence=0.5,
)
detector = HandLandmarker.create_from_options(options)

header = ["label"] + [f"{c}{i}" for i in range(42) for c in ("x", "y", "z")]
rows: list[list] = []

CONNECTIONS = [
    (0,1),(1,2),(2,3),(3,4),
    (0,5),(5,6),(6,7),(7,8),
    (0,9),(9,10),(10,11),(11,12),
    (0,13),(13,14),(14,15),(15,16),
    (0,17),(17,18),(18,19),(19,20),
    (5,9),(9,13),(13,17),
]

def put_text(img, text, pos, scale=0.65, color=COL_WHITE, thickness=2):
    font = cv2.FONT_HERSHEY_SIMPLEX
    (tw, th), bl = cv2.getTextSize(text, font, scale, thickness)
    x, y = pos
    cv2.rectangle(img, (x-4, y-th-4), (x+tw+4, y+bl+4), COL_DARK, -1)
    cv2.putText(img, text, (x, y), font, scale, color, thickness, cv2.LINE_AA)

def draw_landmarks(img, landmarks_list):
    h, w = img.shape[:2]
    for hand_lms in landmarks_list:
        pts = [(int(lm.x * w), int(lm.y * h)) for lm in hand_lms]
        for a, b in CONNECTIONS:
            if a < len(pts) and b < len(pts):
                cv2.line(img, pts[a], pts[b], COL_GREEN, 2)
        for pt in pts:
            cv2.circle(img, pt, 4, COL_WHITE, -1)
            cv2.circle(img, pt, 4, COL_GREEN, 1)

def extract_vector(result):
    if not result.hand_landmarks:
        return None
    vec = [0.0] * 126
    for idx, handedness in enumerate(result.handedness):
        label = handedness[0].category_name
        offset = 63 if label == "Right" else 0
        for j, lm in enumerate(result.hand_landmarks[idx]):
            vec[offset + j*3]     = lm.x
            vec[offset + j*3 + 1] = lm.y
            vec[offset + j*3 + 2] = lm.z
    return vec

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("ERROR: Cannot open webcam. Check camera permissions.")
    sys.exit(1)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

sign_idx  = 0
state     = "IDLE"
captured  = 0
frame_ms  = 0

print("\n=== ISL Webcam Data Collector ===")
print(f"Signs:  {' '.join(SIGNS)}")
print(f"Frames: {FRAMES_PER_SIGN} per sign")
print("SPACE=capture  ENTER=skip  Q=quit\n")

while sign_idx < len(SIGNS):
    ret, frame = cap.read()
    if not ret:
        break

    frame    = cv2.flip(frame, 1)
    h, w     = frame.shape[:2]
    frame_ms += 33

    mp_img = mp.Image(image_format=mp.ImageFormat.SRGB,
                      data=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    result = detector.detect_for_video(mp_img, frame_ms * 1000)
    draw_landmarks(frame, result.hand_landmarks or [])

    sign = SIGNS[sign_idx]
    put_text(frame, f"Sign: {sign}  ({sign_idx+1}/{len(SIGNS)})", (10, 35),
             scale=1.0, color=COL_YELLOW)

    hand_ok  = bool(result.hand_landmarks)
    hand_col = COL_GREEN if hand_ok else COL_RED
    put_text(frame, "Hand detected" if hand_ok else "No hand visible", (10, 75), color=hand_col)

    if state == "IDLE":
        put_text(frame, "Hold sign steady then press SPACE", (10, h-50))
        put_text(frame, "ENTER/N=skip  Q=quit", (10, h-20))

    elif state == "CAPTURING":
        bar_fill = int((captured / FRAMES_PER_SIGN) * (w - 20))
        cv2.rectangle(frame, (10, h-28), (w-10, h-8), (50,50,50), -1)
        cv2.rectangle(frame, (10, h-28), (10+bar_fill, h-8), COL_GREEN, -1)
        put_text(frame, f"Capturing {captured}/{FRAMES_PER_SIGN}", (10, h-38), color=COL_GREEN)

        if hand_ok:
            vec = extract_vector(result)
            if vec:
                rows.append([sign] + vec)
                captured += 1
        else:
            put_text(frame, "HAND LOST - hold still!", (10, 115), color=COL_RED)

        if captured >= FRAMES_PER_SIGN:
            state = "DONE"
            print(f"  [{sign}] {captured} frames captured")

    elif state == "DONE":
        put_text(frame, f"Done! {captured} frames.", (10, h-50), color=COL_GREEN)
        put_text(frame, "ENTER/N=next sign  Q=quit", (10, h-20))

    cv2.imshow("ISL Data Collector", frame)
    key = cv2.waitKey(1) & 0xFF

    if key == ord("q"):
        print("\nQuitting...")
        break
    elif key in (ord("n"), 13, 10):  # N key or ENTER (CR/LF)
        if state in ("IDLE", "DONE"):
            sign_idx += 1
            state    = "IDLE"
            captured = 0
    elif key == ord(" "):
        if state in ("IDLE", "DONE"):
            state    = "CAPTURING"
            captured = 0

cap.release()
cv2.destroyAllWindows()
detector.close()

if not rows:
    print("No data collected. Exiting.")
    sys.exit(0)

print(f"\nSaving {len(rows)} frames to {WEBCAM_CSV}...")
with open(WEBCAM_CSV, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)
print("Saved!")

if MERGED_CSV.exists():
    ans = input(f"\nMerge with {MERGED_CSV.name} and retrain? [y/N] ").strip().lower()
    if ans == "y":
        import pandas as pd
        existing = pd.read_csv(MERGED_CSV, low_memory=False)
        new_data = pd.read_csv(WEBCAM_CSV, low_memory=False)
        merged   = pd.concat([existing, new_data], ignore_index=True)
        merged.to_csv(MERGED_CSV, index=False)
        print(f"Merged: {len(existing)} + {len(new_data)} = {len(merged)} total samples")
        ans2 = input("\nStart retraining now? (30-90 min) [y/N] ").strip().lower()
        if ans2 == "y":
            subprocess.run([sys.executable, str(Path(__file__).with_name("train_model.py"))])
else:
    WEBCAM_CSV.rename(MERGED_CSV)
    ans = input("Start retraining now? [y/N] ").strip().lower()
    if ans == "y":
        subprocess.run([sys.executable, str(Path(__file__).with_name("train_model.py"))])

print("\nDone! Restart isl_api.py to load the new model.")
