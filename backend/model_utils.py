from __future__ import annotations

from itertools import combinations

import numpy as np

HAND_LANDMARKS = 21
LANDMARK_DIMENSIONS = 3
RAW_FEATURE_COUNT = HAND_LANDMARKS * LANDMARK_DIMENSIONS

FINGERTIP_INDICES = (4, 8, 12, 16, 20)
ANGLE_TRIPLETS = (
    (0, 1, 2), (1, 2, 3), (2, 3, 4),
    (0, 5, 6), (5, 6, 7), (6, 7, 8),
    (0, 9, 10), (9, 10, 11), (10, 11, 12),
    (0, 13, 14), (13, 14, 15), (14, 15, 16),
    (0, 17, 18), (17, 18, 19), (18, 19, 20),
)


def reshape_landmarks(data: np.ndarray | list[float]) -> np.ndarray:
    arr = np.asarray(data, dtype=float)
    if arr.ndim == 1:
        if arr.size != RAW_FEATURE_COUNT:
            raise ValueError(
                f"Expected {RAW_FEATURE_COUNT} landmark values, got {arr.size}."
            )
        return arr.reshape(1, HAND_LANDMARKS, LANDMARK_DIMENSIONS)

    if arr.ndim == 2 and arr.shape == (HAND_LANDMARKS, LANDMARK_DIMENSIONS):
        return arr.reshape(1, HAND_LANDMARKS, LANDMARK_DIMENSIONS)

    if arr.ndim == 2 and arr.shape[1] == RAW_FEATURE_COUNT:
        return arr.reshape(arr.shape[0], HAND_LANDMARKS, LANDMARK_DIMENSIONS)

    if arr.ndim == 3 and arr.shape[1:] == (HAND_LANDMARKS, LANDMARK_DIMENSIONS):
        return arr

    raise ValueError(f"Unsupported landmark shape: {arr.shape}")


def _safe_normalize(vector: np.ndarray, fallback: np.ndarray) -> np.ndarray:
    norm = float(np.linalg.norm(vector))
    if norm < 1e-8:
        return fallback
    return vector / norm


def normalize_hand_landmarks(hand: np.ndarray) -> np.ndarray:
    centered = hand - hand[0]

    palm_forward = centered[9]
    palm_side = centered[5] - centered[17]

    y_axis = _safe_normalize(palm_forward, np.array([0.0, 1.0, 0.0]))
    z_axis = _safe_normalize(np.cross(palm_side, y_axis), np.array([0.0, 0.0, 1.0]))
    x_axis = _safe_normalize(np.cross(y_axis, z_axis), np.array([1.0, 0.0, 0.0]))
    z_axis = _safe_normalize(np.cross(x_axis, y_axis), np.array([0.0, 0.0, 1.0]))

    rotation = np.stack([x_axis, y_axis, z_axis], axis=1)
    canonical = centered @ rotation

    scale = float(np.max(np.linalg.norm(canonical, axis=1)))
    if scale < 1e-8:
        scale = 1.0

    return canonical / scale


def _joint_angle(hand: np.ndarray, a: int, b: int, c: int) -> float:
    ba = hand[a] - hand[b]
    bc = hand[c] - hand[b]
    ba = _safe_normalize(ba, np.array([1.0, 0.0, 0.0]))
    bc = _safe_normalize(bc, np.array([1.0, 0.0, 0.0]))
    cosine = float(np.clip(np.dot(ba, bc), -1.0, 1.0))
    return float(np.arccos(cosine))


def hand_to_feature_vector(hand: np.ndarray) -> np.ndarray:
    canonical = normalize_hand_landmarks(hand)
    wrist_distances = np.linalg.norm(canonical, axis=1)
    fingertip_distances = [
        float(np.linalg.norm(canonical[i] - canonical[j]))
        for i, j in combinations(FINGERTIP_INDICES, 2)
    ]
    joint_angles = [
        _joint_angle(canonical, a, b, c)
        for a, b, c in ANGLE_TRIPLETS
    ]

    return np.concatenate(
        [
            canonical.reshape(-1),
            wrist_distances,
            np.asarray(fingertip_distances, dtype=float),
            np.asarray(joint_angles, dtype=float),
        ]
    )


def build_feature_matrix(data: np.ndarray | list[float]) -> np.ndarray:
    hands = reshape_landmarks(data)
    return np.vstack([hand_to_feature_vector(hand) for hand in hands])
