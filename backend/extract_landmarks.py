"""
Stage 2 — Extract Hand Landmarks from ISL Dataset
=================================================
Fixed for MediaPipe 0.10.x+ which uses new Tasks API
"""

import os
import csv
import cv2
import numpy as np
import urllib.request

# ── Paths ─────────────────────────────────────────────────────────────────────
DATASET_DIR = r"C:\Users\Prem\Downloads\isl-dataset\indian"
OUTPUT_CSV  = r"C:\Users\Prem\Downloads\landmarks.csv"
MODEL_PATH  = r"C:\Users\Prem\Downloads\hand_landmarker.task"

# ── Download MediaPipe hand landmarker model if not present ───────────────────
if not os.path.exists(MODEL_PATH):
    print("Downloading MediaPipe hand landmarker model (~9MB)...")
    url = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
    urllib.request.urlretrieve(url, MODEL_PATH)
    print("Model downloaded!\n")

# ── MediaPipe new Tasks API setup ─────────────────────────────────────────────
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision
from mediapipe.tasks.python.vision import HandLandmarker, HandLandmarkerOptions, RunningMode

options = HandLandmarkerOptions(
    base_options=mp_python.BaseOptions(model_asset_path=MODEL_PATH),
    running_mode=RunningMode.IMAGE,
    num_hands=2,
    min_hand_detection_confidence=0.7,
    min_hand_presence_confidence=0.7,
    min_tracking_confidence=0.7,
)
detector = HandLandmarker.create_from_options(options)

# ── CSV header ────────────────────────────────────────────────────────────────
header = ['label']
for i in range(42):
    header += [f'x{i}', f'y{i}', f'z{i}']

# ── Process dataset ───────────────────────────────────────────────────────────
rows         = []
skipped      = 0
processed    = 0
total_images = 0

# Count total images
for label in sorted(os.listdir(DATASET_DIR)):
    label_dir = os.path.join(DATASET_DIR, label)
    if os.path.isdir(label_dir):
        total_images += len([
            f for f in os.listdir(label_dir)
            if f.lower().endswith(('.jpg', '.jpeg', '.png'))
        ])

print(f"Found {total_images} total images")
print(f"Estimated time: ~{total_images * 0.04 / 60:.0f} minutes")
print(f"Starting extraction...\n")

import mediapipe as mp

for label in sorted(os.listdir(DATASET_DIR)):
    label_dir = os.path.join(DATASET_DIR, label)
    if not os.path.isdir(label_dir):
        continue

    images = [
        f for f in os.listdir(label_dir)
        if f.lower().endswith(('.jpg', '.jpeg', '.png'))
    ]

    label_processed = 0
    label_skipped   = 0

    for img_idx, img_file in enumerate(images):
        img_path = os.path.join(label_dir, img_file)
        if img_idx % 100 == 0:
            print(f"    [{label}] {img_idx}/{len(images)} images...", flush=True)

        # Read image with OpenCV
        img_bgr = cv2.imread(img_path)
        if img_bgr is None:
            label_skipped += 1
            skipped += 1
            continue

        # Convert to RGB
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

        # Create MediaPipe Image
        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=img_rgb
        )

        # Detect landmarks
        result = detector.detect(mp_image)

        if not result.hand_landmarks or len(result.hand_landmarks) == 0:
            label_skipped += 1
            skipped += 1
            continue

        # Extract 126 elements (42 landmarks * 3 coords)
        # Left -> offset 0, Right -> offset 63
        combined_features = [0.0] * 126
        for idx, handedness in enumerate(result.handedness):
            hand_label = handedness[0].category_name
            landmarks = result.hand_landmarks[idx]
            
            offset = 63 if hand_label == "Right" else 0
            for j, lm in enumerate(landmarks):
                combined_features[offset + j*3]     = lm.x
                combined_features[offset + j*3 + 1] = lm.y
                combined_features[offset + j*3 + 2] = lm.z

        rows.append([label] + combined_features)
        label_processed += 1
        processed += 1

    print(f"  {label:>4} — processed: {label_processed:>4}  skipped: {label_skipped:>4}")

# ── Write CSV ─────────────────────────────────────────────────────────────────
print(f"\nWriting {len(rows)} rows to CSV...")

with open(OUTPUT_CSV, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)

# ── Summary ───────────────────────────────────────────────────────────────────
print(f"\n{'='*50}")
print("DONE! CSV saved.")
print(f"{'='*50}")
print(f"Total images       : {total_images}")
print(f"Successfully processed: {processed}")
print(f"Skipped (no hand)  : {skipped}")
print(f"Success rate       : {processed/total_images*100:.1f}%")
print(f"\nOutput saved to: {OUTPUT_CSV}")
print(f"Next step: run  py -3.11 train_model.py")

detector.close()
