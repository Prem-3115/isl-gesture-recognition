"""
download_and_extract.py
=======================
Downloads the ISL image dataset one letter at a time using kagglehub,
runs MediaPipe on each image immediately, writes landmarks to CSV,
then deletes the images to free disk/RAM before moving to the next letter.

This avoids the MemoryError caused by downloading the full 600MB at once.
"""

import os
import csv
import shutil
import gc

import cv2
import numpy as np

# ── MediaPipe setup ──────────────────────────────────────────────────────────
import urllib.request
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python.vision import HandLandmarker, HandLandmarkerOptions, RunningMode
import mediapipe as mp

MODEL_PATH = r"C:\Users\Prem\Downloads\hand_landmarker.task"
OUTPUT_CSV = r"C:\Users\Prem\Downloads\landmarks.csv"
SCRATCH_DIR = r"C:\Users\Prem\Downloads\isl_scratch"

if not os.path.exists(MODEL_PATH):
    print("Downloading MediaPipe hand landmarker model (~9MB)...")
    url = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
    urllib.request.urlretrieve(url, MODEL_PATH)
    print("Model downloaded!\n")

options = HandLandmarkerOptions(
    base_options=mp_python.BaseOptions(model_asset_path=MODEL_PATH),
    running_mode=RunningMode.IMAGE,
    num_hands=2,
    min_hand_detection_confidence=0.7,
    min_hand_presence_confidence=0.7,
    min_tracking_confidence=0.7,
)
detector = HandLandmarker.create_from_options(options)

# ── CSV header: 42 landmarks (Left=0-20, Right=21-41) ────────────────────────
header = ['label']
for i in range(42):
    header += [f'x{i}', f'y{i}', f'z{i}']

os.makedirs(SCRATCH_DIR, exist_ok=True)

# ── Letters A-Z ──────────────────────────────────────────────────────────────
LETTERS = [chr(i) for i in range(ord('A'), ord('Z') + 1)]

total_processed = 0
total_skipped = 0

# Write header first
write_mode = 'w'

for letter in LETTERS:
    print(f"\n{'='*50}")
    print(f"Processing letter: {letter}")
    print(f"{'='*50}")

    # Download just this letter's folder
    letter_scratch = os.path.join(SCRATCH_DIR, letter)
    os.makedirs(letter_scratch, exist_ok=True)

    try:
        import kagglehub
        # Download single-letter path
        dl_path = kagglehub.dataset_download(
            "atharvadumbre/indian-sign-language-islrtc-referred",
            path=letter
        )
        print(f"Downloaded to: {dl_path}")
    except Exception as e:
        print(f"  WARN: Could not download letter {letter} via kagglehub: {e}")
        print(f"  Trying fallback path inside scratch dir...")
        dl_path = letter_scratch
        if not os.listdir(dl_path):
            print(f"  SKIP {letter} — no images found.")
            continue

    # Find images
    images = [
        os.path.join(dl_path, f)
        for f in os.listdir(dl_path)
        if f.lower().endswith(('.jpg', '.jpeg', '.png'))
    ]

    if not images:
        # Try one level deeper
        for sub in os.listdir(dl_path):
            sub_path = os.path.join(dl_path, sub)
            if os.path.isdir(sub_path):
                images += [
                    os.path.join(sub_path, f)
                    for f in os.listdir(sub_path)
                    if f.lower().endswith(('.jpg', '.jpeg', '.png'))
                ]

    print(f"  Found {len(images)} images for letter {letter}")

    letter_rows = []
    letter_processed = 0
    letter_skipped = 0

    for img_path in images:
        img_bgr = cv2.imread(img_path)
        if img_bgr is None:
            letter_skipped += 1
            continue

        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)

        try:
            result = detector.detect(mp_image)
        except Exception:
            letter_skipped += 1
            continue

        if not result.hand_landmarks:
            letter_skipped += 1
            continue

        # Build 126-feature vector: Left=offset 0, Right=offset 63
        combined = [0.0] * 126
        for idx, handedness in enumerate(result.handedness):
            hand_label = handedness[0].category_name
            landmarks = result.hand_landmarks[idx]
            offset = 63 if hand_label == "Right" else 0
            for j, lm in enumerate(landmarks):
                combined[offset + j*3]     = lm.x
                combined[offset + j*3 + 1] = lm.y
                combined[offset + j*3 + 2] = lm.z

        letter_rows.append([letter] + combined)
        letter_processed += 1

        # Free image memory
        del img_bgr, img_rgb, mp_image
        gc.collect()

    print(f"  Processed: {letter_processed}  Skipped: {letter_skipped}")

    # Append to CSV
    with open(OUTPUT_CSV, write_mode, newline='') as f:
        writer = csv.writer(f)
        if write_mode == 'w':
            writer.writerow(header)
        writer.writerows(letter_rows)
    write_mode = 'a'  # Append for all subsequent letters

    total_processed += letter_processed
    total_skipped += letter_skipped

    # Clean up downloaded images to free disk space
    try:
        if os.path.exists(letter_scratch) and letter_scratch != dl_path:
            shutil.rmtree(letter_scratch, ignore_errors=True)
    except Exception:
        pass

    del letter_rows
    gc.collect()
    print(f"  Wrote {letter_processed} rows to CSV. RAM freed.")

# ── Done ─────────────────────────────────────────────────────────────────────
detector.close()

print(f"\n{'='*50}")
print(f"DONE!")
print(f"{'='*50}")
print(f"Total processed : {total_processed}")
print(f"Total skipped   : {total_skipped}")
print(f"CSV saved at    : {OUTPUT_CSV}")
print(f"Next step       : python train_model.py")
