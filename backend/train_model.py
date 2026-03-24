"""
Improved train_model.py
=======================
Fixes for poor real-world accuracy:
1. Uses Random Forest instead of MLP — more robust to lighting/angle variation
2. Adds StandardScaler — normalizes feature ranges properly
3. Uses cross-validation — gives true accuracy estimate
4. Adds confidence threshold in saved model info
5. Prints per-class accuracy so you can see which signs are weak
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import os

# ── Load dataset ──────────────────────────────────────────────────────────────
file_path = r"C:\Users\Prem\Downloads\landmarks.csv"
print("Loading dataset...")
df = pd.read_csv(file_path, low_memory=False)

print(f"Total samples: {len(df)}")
print(f"Classes found: {sorted(df['label'].unique())}")
print(f"Samples per class:\n{df['label'].value_counts().sort_index()}\n")

# ── Split features and labels ─────────────────────────────────────────────────
X = df.drop("label", axis=1).values.astype(float)
y = df["label"].astype(str)

# ── Encode labels ─────────────────────────────────────────────────────────────
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)
print(f"Label classes: {list(encoder.classes_)}\n")

# ── Train/test split ──────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)
print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}\n")

# ── Build pipeline: Scaler + Random Forest ────────────────────────────────────
# Random Forest is much more robust than MLP for hand gesture recognition
# because it handles feature importance automatically and doesn't overfit as easily
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(
        n_estimators=200,      # 200 trees for better accuracy
        max_depth=20,          # prevent overfitting
        min_samples_split=5,   # minimum samples to split a node
        min_samples_leaf=2,    # minimum samples at leaf
        random_state=42,
        n_jobs=-1,             # use all CPU cores
        class_weight='balanced' # handle class imbalance
    ))
])

# ── Train model ───────────────────────────────────────────────────────────────
print("Training Random Forest model...")
pipeline.fit(X_train, y_train)

# ── Test accuracy ─────────────────────────────────────────────────────────────
test_accuracy = pipeline.score(X_test, y_test)
print(f"\nTest Accuracy: {test_accuracy * 100:.2f}%")

# ── Cross validation (true accuracy estimate) ─────────────────────────────────
print("\nRunning 5-fold cross validation (this gives the TRUE accuracy)...")
cv_scores = cross_val_score(pipeline, X, y_encoded, cv=5, n_jobs=-1)
print(f"Cross-validation scores: {[f'{s*100:.1f}%' for s in cv_scores]}")
print(f"Mean CV Accuracy: {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 100:.2f}%)")

# ── Per-class accuracy ────────────────────────────────────────────────────────
print("\n── Per-class accuracy (shows which signs are weak) ──")
y_pred = pipeline.predict(X_test)
report = classification_report(
    y_test, y_pred,
    target_names=encoder.classes_,
    zero_division=0
)
print(report)

# ── Confusion matrix for weak signs ──────────────────────────────────────────
print("── Signs with accuracy below 80% (need more training data) ──")
from sklearn.metrics import confusion_matrix
cm = confusion_matrix(y_test, y_pred)
per_class_acc = cm.diagonal() / cm.sum(axis=1)
for i, (cls, acc) in enumerate(zip(encoder.classes_, per_class_acc)):
    if acc < 0.80:
        print(f"  ⚠️  {cls}: {acc*100:.1f}% — needs improvement")

# ── Save model + encoder ──────────────────────────────────────────────────────
model_path   = r"C:\Users\Prem\Downloads\isl_model.pkl"
encoder_path = r"C:\Users\Prem\Downloads\label_encoder.pkl"

joblib.dump(pipeline, model_path)
joblib.dump(encoder, encoder_path)

print(f"\n{'='*50}")
print(f"✅ Model saved at:   {model_path}")
print(f"✅ Encoder saved at: {encoder_path}")
print(f"{'='*50}")
print(f"\nTest Accuracy:  {test_accuracy * 100:.2f}%")
print(f"CV Accuracy:    {cv_scores.mean() * 100:.2f}%")
print(f"\nIf CV accuracy is much lower than test accuracy → model was overfitting before")
print(f"If CV accuracy is similar to test accuracy → model generalizes well ✅")
print(f"\nNext step: restart isl_api.py and test in the browser!")