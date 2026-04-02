from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import ExtraTreesClassifier, RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.base import clone

from model_utils import build_feature_matrix


DATASET_PATH = Path(__file__).with_name("landmarks.csv")
MODEL_PATH = Path(__file__).with_name("isl_model.pkl")
ENCODER_PATH = Path(__file__).with_name("label_encoder.pkl")


print("Loading dataset...")
df = pd.read_csv(DATASET_PATH, low_memory=False)
print(f"Total samples: {len(df)}")
print(f"Classes found: {sorted(df['label'].unique())}")
print(f"Samples per class:\n{df['label'].value_counts().sort_index()}\n")

raw_landmarks = df.drop("label", axis=1).values.astype(float)
labels = df["label"].astype(str)

print("Building rotation- and scale-stable features...")
X = build_feature_matrix(raw_landmarks)

encoder = LabelEncoder()
y = encoder.fit_transform(labels)
print(f"Label classes: {list(encoder.classes_)}")
print(f"Feature vector size: {X.shape[1]}\n")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}\n")

model = VotingClassifier(
    estimators=[
        (
            "rf",
            RandomForestClassifier(
                n_estimators=350,
                max_features="sqrt",
                min_samples_leaf=2,
                class_weight="balanced_subsample",
                random_state=42,
                n_jobs=1,
            ),
        ),
        (
            "et",
            ExtraTreesClassifier(
                n_estimators=500,
                max_features="sqrt",
                min_samples_leaf=2,
                class_weight="balanced",
                random_state=42,
                n_jobs=1,
            ),
        ),
        (
            "lr",
            make_pipeline(
                StandardScaler(),
                LogisticRegression(max_iter=2500),
            ),
        ),
    ],
    voting="soft",
    weights=[3, 4, 1],
    n_jobs=1,
)

print("Training ensemble model...")
model.fit(X_train, y_train)

test_accuracy = model.score(X_test, y_test)
print(f"\nTest Accuracy: {test_accuracy * 100:.2f}%")

print("\nRunning 5-fold cross validation...")
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
try:
    cv_scores_list = []
    for fold_index, (train_idx, val_idx) in enumerate(cv.split(X, y), start=1):
        fold_model = clone(model)
        fold_model.fit(X[train_idx], y[train_idx])
        fold_score = fold_model.score(X[val_idx], y[val_idx])
        cv_scores_list.append(fold_score)
        print(f"Fold {fold_index}: {fold_score * 100:.2f}%")

    cv_scores = np.asarray(cv_scores_list, dtype=float)
    print(f"Cross-validation scores: {[f'{score * 100:.1f}%' for score in cv_scores]}")
    print(f"Mean CV Accuracy: {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 100:.2f}%)")
except Exception as exc:
    cv_scores = np.array([])
    print(f"Cross-validation failed: {exc}")
    print("Tip: if training works but CV fails, reduce parallelism or skip CV during iteration.")

print("\nPer-class accuracy")
y_pred = model.predict(X_test)
print(
    classification_report(
        y_test,
        y_pred,
        target_names=encoder.classes_,
        zero_division=0,
    )
)

print("Signs with accuracy below 80%")
cm = confusion_matrix(y_test, y_pred)
per_class_acc = cm.diagonal() / np.maximum(cm.sum(axis=1), 1)
for sign, acc in zip(encoder.classes_, per_class_acc):
    if acc < 0.80:
        print(f"  {sign}: {acc * 100:.1f}%")

joblib.dump(model, MODEL_PATH)
joblib.dump(encoder, ENCODER_PATH)

print(f"\n{'=' * 50}")
print(f"Model saved at:   {MODEL_PATH}")
print(f"Encoder saved at: {ENCODER_PATH}")
print(f"{'=' * 50}")
print(f"\nTest Accuracy: {test_accuracy * 100:.2f}%")
if cv_scores.size:
    print(f"CV Accuracy:   {cv_scores.mean() * 100:.2f}%")
else:
    print("CV Accuracy:   unavailable")
print("\nNext step: restart isl_api.py and test in the browser.")
