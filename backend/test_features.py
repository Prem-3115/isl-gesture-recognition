import numpy as np
from model_utils import build_feature_matrix, RAW_FEATURE_COUNT

print(f"RAW_FEATURE_COUNT = {RAW_FEATURE_COUNT}")
assert RAW_FEATURE_COUNT == 126

# Create dummy input data of size 126
dummy_data = np.random.rand(126)

print("Running feature extraction on dummy data...")
features = build_feature_matrix(dummy_data)

print(f"Feature matrix shape: {features.shape}")
expected_features = 218
print(f"Expected 218 features (109 per hand). Got {features.shape[1]}")
if features.shape[1] == expected_features:
    print("SUCCESS: Feature extraction shape matches expected output.")
else:
    print("FAILED")
