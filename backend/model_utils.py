from __future__ import annotations

from itertools import combinations

import numpy as np

HAND_LANDMARKS = 42
LANDMARK_DIMENSIONS = 3
RAW_FEATURE_COUNT = HAND_LANDMARKS * LANDMARK_DIMENSIONS

FINGERTIP_INDICES = (4, 8, 12, 16, 20)

ANGLE_TRIPLETS = (
    # Flexion angles — along each finger's chain
    (0, 1, 2), (1, 2, 3), (2, 3, 4),           # thumb
    (0, 5, 6), (5, 6, 7), (6, 7, 8),            # index
    (0, 9, 10), (9, 10, 11), (10, 11, 12),      # middle
    (0, 13, 14), (13, 14, 15), (14, 15, 16),    # ring
    (0, 17, 18), (17, 18, 19), (18, 19, 20),    # pinky
    # Abduction angles — spread between adjacent fingers at MCP level
    # Fix #11: these distinguish signs like R/U, V/3, 4/5 that differ only in spread
    (1, 0, 5),    # thumb–index spread
    (5, 0, 9),    # index–middle spread
    (9, 0, 13),   # middle–ring spread
    (13, 0, 17),  # ring–pinky spread
)

# Single source of truth for feature vector length per hand (Fix #10)
# 21 landmarks×3 coords  +  21 wrist distances  +  C(5,2)=10 fingertip distances
# + len(ANGLE_TRIPLETS) joint/abduction angles  =  113
FEATURES_PER_HAND: int = 21 * 3 + 21 + 10 + len(ANGLE_TRIPLETS)


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


def normalize_single_hand(hand: np.ndarray) -> np.ndarray:
    """Return a rotation- and scale-invariant canonical representation.

    Fix #1: Full Gram-Schmidt orthonormalization.
    The original code passed palm_side directly into the cross product with
    y_axis. When the hand is seen nearly edge-on, palm_side and y_axis become
    nearly parallel, so their cross product collapses to near-zero and the
    [0,0,1] fallback fires — destroying rotation invariance for that frame.

    The fix: project palm_side onto the plane perpendicular to y_axis first
    (Gram-Schmidt step), so the cross product always yields a well-defined z_axis.
    """
    centered = hand - hand[0]

    # After centering, centered[0] == origin, so centered[9] is already the
    # wrist→MCP9 direction vector — a valid palm "up" (y) direction.
    palm_forward = centered[9]
    # Side vector across the palm (index MCP → pinky MCP).
    palm_side = centered[5] - centered[17]

    # ── Full Gram-Schmidt orthonormal frame ──────────────────────────────
    # Step 1: primary axis — palm forward direction
    y_axis = _safe_normalize(palm_forward, np.array([0.0, 1.0, 0.0]))

    # Step 2: remove the y-component from palm_side so the cross product
    # never collapses, even when palm_side ∥ y_axis (edge-on hand views).
    palm_side_ortho = palm_side - np.dot(palm_side, y_axis) * y_axis
    z_axis = _safe_normalize(
        np.cross(palm_side_ortho, y_axis), np.array([0.0, 0.0, 1.0])
    )

    # Step 3: derive x from the corrected y and z
    x_axis = _safe_normalize(np.cross(y_axis, z_axis), np.array([1.0, 0.0, 0.0]))

    # Step 4: re-derive z to guarantee strict orthonormality
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


def _extract_single_hand_features(hand: np.ndarray) -> np.ndarray:
    # Fix #4: use exact equality instead of np.allclose.
    # np.allclose (rtol=1e-5, atol=1e-8) returned True for real hands near the
    # frame edge whose x/y coords are small but non-zero, silently discarding
    # valid landmark data. Absent hands are always set to exactly 0.0 by both
    # extract_landmarks.py and the frontend, so exact equality is safe here.
    if np.all(hand == 0.0):
        return np.zeros(FEATURES_PER_HAND)
        
    canonical = normalize_single_hand(hand)
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

def hand_to_feature_vector(both_hands: np.ndarray) -> np.ndarray:
    # both_hands is shape (42, 3)
    left_hand = both_hands[0:21]
    right_hand = both_hands[21:42]
    
    left_features = _extract_single_hand_features(left_hand)
    right_features = _extract_single_hand_features(right_hand)
    
    return np.concatenate([left_features, right_features])


def build_feature_matrix(data: np.ndarray | list[float]) -> np.ndarray:
    hands = reshape_landmarks(data)
    return np.vstack([hand_to_feature_vector(hand) for hand in hands])
