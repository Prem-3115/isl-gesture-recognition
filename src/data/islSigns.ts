// ISL Sign Definitions — Based on official ISL fingerspelling chart
// Source: Indian Sign Language Research & Training Centre (ISLRTC)
//
// KEY FACT: ISL fingerspelling is largely TWO-HANDED (BSL-based).
// Only a few letters (I, J, L, O, Y, Z) and numbers are single-handed.
// Two-handed signs CANNOT be reliably detected with a single webcam + MediaPipe.
//
// From the chart:
// TWO-HANDED: A, B, C, D, E, F, G, H, K, M, N, P, Q, R, S, T, U, V, W, X
// SINGLE-HANDED: I, J, L, O, Y, Z
// NUMBERS: 0-10 are single-handed (shown with one hand in chart)

export type Landmark = { x: number; y: number; z: number };
export type FingerState = 'extended' | 'bent' | 'curled' | 'any';

export interface ISLSign {
  id: string;
  label: string;
  category: 'alphabet' | 'number' | 'greeting';
  description: string;
  instruction: string;
  emoji: string;
  twoHanded: boolean;
  // Finger states for dominant/active hand: [thumb, index, middle, ring, pinky]
  fingerStates: FingerState[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function isThumbExtended(landmarks: Landmark[]): boolean {
  return Math.abs(landmarks[4].x - landmarks[3].x) > 0.04;
}

export function isFingerExtended(landmarks: Landmark[], tip: number, pip: number): boolean {
  return landmarks[tip].y < landmarks[pip].y;
}

export function isFingerCurled(landmarks: Landmark[], tip: number, mcp: number): boolean {
  return landmarks[tip].y > landmarks[mcp].y;
}

export function landmarkDistance(a: Landmark, b: Landmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

export function evaluateFingerStates(landmarks: Landmark[]): boolean[] {
  // Returns [thumb, index, middle, ring, pinky] -> true = extended
  return [
    isThumbExtended(landmarks),
    isFingerExtended(landmarks, 8, 6),
    isFingerExtended(landmarks, 12, 10),
    isFingerExtended(landmarks, 16, 14),
    isFingerExtended(landmarks, 20, 18),
  ];
}

export function scoreSign(landmarks: Landmark[], sign: ISLSign): number {
  if (sign.twoHanded) return 0; // cannot score two-handed signs with single camera

  const fingerStates = evaluateFingerStates(landmarks);
  let score = 0;
  let total = 0;

  sign.fingerStates.forEach((expected, i) => {
    if (expected === 'any') return;
    total++;
    const isExtended = fingerStates[i];
    if (expected === 'extended' && isExtended) score++;
    if ((expected === 'bent' || expected === 'curled') && !isExtended) score++;
  });

  if (total === 0) return 75;
  const base = (score / total) * 100;
  const bonus = proximityScore(landmarks, sign);
  return Math.round(base * 0.6 + bonus * 0.4);
}

function proximityScore(landmarks: Landmark[], sign: ISLSign): number {
  const wrist = landmarks[0];
  const distances = [4, 8, 12, 16, 20].map(tip => landmarkDistance(landmarks[tip], wrist));
  const avg = distances.reduce((a, b) => a + b, 0) / distances.length;
  const extended = evaluateFingerStates(landmarks).filter(Boolean).length;
  const expExtended = sign.fingerStates.filter(s => s === 'extended').length;
  const expCurled = sign.fingerStates.filter(s => s === 'bent' || s === 'curled').length;
  let ps = 70;
  if (expExtended >= 4 && avg > 0.3) ps += 20;
  if (expCurled >= 4 && avg < 0.2) ps += 20;
  if (Math.abs(extended - expExtended) <= 1) ps += 10;
  return Math.min(ps, 100);
}

// ── ISL ALPHABET ──────────────────────────────────────────────────────────────
// Based on actual ISL fingerspelling chart (ISLRTC)

export const ISL_ALPHABET: ISLSign[] = [
  // ─ A: Two hands, fingers interlocked/spread pointing outward ─
  {
    id: 'A', label: 'A', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands with fingers spread facing each other',
    instruction: 'Hold both hands in front with fingers spread. Face palms toward each other with fingertips pointing up.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ B: Two hands, fingertips touching forming B shape ─
  {
    id: 'B', label: 'B', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Fingertips of both hands touch to form a B shape',
    instruction: 'Bring both hands together with fingertips touching, thumbs pointing downward.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ C: SINGLE-HANDED — one curved hand forming C ─
  {
    id: 'C', label: 'C', category: 'alphabet', emoji: '🤌', twoHanded: false,
    description: '✅ Single-handed: One hand curved to form a C shape',
    instruction: 'Curve all fingers and thumb of one hand to form a C shape, like holding a cup. Palm faces sideways.',
    fingerStates: ['bent', 'bent', 'bent', 'bent', 'bent'],
  },
  // ─ D: Two hands, one hand forms D against the other ─
  {
    id: 'D', label: 'D', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Dominant hand index curled against flat passive hand',
    instruction: 'Hold passive hand flat, touch curled index finger of dominant hand to form a D.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ E: Two hands, fingers bent against each other ─
  {
    id: 'E', label: 'E', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands with bent fingers interlocked',
    instruction: 'Bend fingers of both hands and bring them together like interlocking.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ F: Two hands spread facing each other ─
  {
    id: 'F', label: 'F', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands spread open facing each other',
    instruction: 'Hold both hands open, fingers spread, palms facing each other.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ G: Two hands, one fist with other hand pointing ─
  {
    id: 'G', label: 'G', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: One hand makes fist, other points',
    instruction: 'Make a fist with one hand, point index finger of other hand toward it.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ H: Two hands, one flat, other rubs across ─
  {
    id: 'H', label: 'H', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: One flat hand, dominant hand moves across it',
    instruction: 'Hold passive hand flat, move dominant hand (two fingers) across it horizontally.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ I: Two-handed based on correct ISL chart ─
  {
    id: 'I', label: 'I', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: ISL I uses both hands',
    instruction: 'Use both hands to form the I shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ J: Two-handed based on chart ─
  {
    id: 'J', label: 'J', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: One hand rests on other while tracing J',
    instruction: 'Use both hands to form the J shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ K: Two hands ─
  {
    id: 'K', label: 'K', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands form K shape together',
    instruction: 'Use both hands to form the K shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ L: Two-handed based on correct ISL chart ─
  {
    id: 'L', label: 'L', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: ISL L uses both hands',
    instruction: 'Use both hands to form the L shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ M: Two hands ─
  {
    id: 'M', label: 'M', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands pressed together forming M',
    instruction: 'Press both hands flat together with fingers spread, like a prayer position.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ N: Two hands, fingers touching ─
  {
    id: 'N', label: 'N', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands with fingertips touching to form N',
    instruction: 'Touch fingertips of both hands together with thumbs pointing down.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ O: Two-handed based on correct ISL chart ─
  {
    id: 'O', label: 'O', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: ISL O uses both hands',
    instruction: 'Use both hands to form the O shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ P: Two hands ─
  {
    id: 'P', label: 'P', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands form P shape',
    instruction: 'Use both hands to form the P shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ Q: Two hands ─
  {
    id: 'Q', label: 'Q', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands form Q shape',
    instruction: 'Use both hands to form the Q shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ R: Two hands ─
  {
    id: 'R', label: 'R', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands form R shape together',
    instruction: 'Use both hands to form the R shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ S: Two hands ─
  {
    id: 'S', label: 'S', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands form S shape',
    instruction: 'Use both hands to form the S shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ T: Two hands ─
  {
    id: 'T', label: 'T', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: One hand forms a T against the other',
    instruction: 'Use both hands to form the T shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ U: Two-handed based on correct ISL chart ─
  {
    id: 'U', label: 'U', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: ISL U uses both hands',
    instruction: 'Use both hands to form the U shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ V: Two-handed based on correct ISL chart ─
  {
    id: 'V', label: 'V', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: ISL V uses both hands',
    instruction: 'Use both hands to form the V shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ W: Two hands ─
  {
    id: 'W', label: 'W', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands form W shape together',
    instruction: 'Use both hands to form the W shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ X: Two hands crossed ─
  {
    id: 'X', label: 'X', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands cross to form X',
    instruction: 'Cross both index fingers to form an X shape.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ Y: Two-handed based on chart ─
  {
    id: 'Y', label: 'Y', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Thumb of one hand on fist of other hand',
    instruction: 'Use both hands to form the Y shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
  // ─ Z: Two-handed based on chart ─
  {
    id: 'Z', label: 'Z', category: 'alphabet', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands involved in forming Z',
    instruction: 'Use both hands to form the Z shape as shown in the ISL chart.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
];

// ── ISL NUMBERS ───────────────────────────────────────────────────────────────
// From the chart: Numbers are shown with ONE hand — all single-handed

export const ISL_NUMBERS: ISLSign[] = [
  // ─ 1: Index finger curled, thumb up (like pointing but bent) ─
  {
    id: '1', label: '1', category: 'number', emoji: '☝️', twoHanded: false,
    description: '✅ Single-handed: Fist with index finger raised and slightly bent',
    instruction: 'Make a fist. Raise only your index finger, slightly bent/hooked. Thumb may rest on side.',
    fingerStates: ['curled', 'extended', 'curled', 'curled', 'curled'],
  },
  // ─ 2: Index and middle fingers up in V ─
  {
    id: '2', label: '2', category: 'number', emoji: '✌️', twoHanded: false,
    description: '✅ Single-handed: Index and middle fingers extended (peace sign / V shape)',
    instruction: 'Extend index and middle fingers in a V shape. Curl ring finger, pinky and thumb down.',
    fingerStates: ['curled', 'extended', 'extended', 'curled', 'curled'],
  },
  // ─ 3: Thumb, index, middle extended ─
  {
    id: '3', label: '3', category: 'number', emoji: '🤟', twoHanded: false,
    description: '✅ Single-handed: Thumb, index and middle fingers extended',
    instruction: 'Extend thumb, index and middle fingers. Curl ring and pinky fingers down.',
    fingerStates: ['extended', 'extended', 'extended', 'curled', 'curled'],
  },
  // ─ 4: Four fingers up, thumb bent across palm ─
  {
    id: '4', label: '4', category: 'number', emoji: '🖖', twoHanded: false,
    description: '✅ Single-handed: Four fingers extended, thumb bent across palm',
    instruction: 'Extend all four fingers straight up. Bend thumb across the palm (tucked in).',
    fingerStates: ['curled', 'extended', 'extended', 'extended', 'extended'],
  },
  // ─ 5: Open hand, all five spread ─
  {
    id: '5', label: '5', category: 'number', emoji: '🖐', twoHanded: false,
    description: '✅ Single-handed: All five fingers spread wide open',
    instruction: 'Spread all five fingers wide apart. Open palm facing forward.',
    fingerStates: ['extended', 'extended', 'extended', 'extended', 'extended'],
  },
  // ─ 6: Pinky and index extended (bull horns) ─
  {
    id: '6', label: '6', category: 'number', emoji: '🤙', twoHanded: false,
    description: '✅ Single-handed: Index and pinky extended, others curled (like bull horns)',
    instruction: 'Extend index finger and pinky finger. Curl middle and ring fingers. Thumb may be tucked.',
    fingerStates: ['curled', 'extended', 'curled', 'curled', 'extended'],
  },
  // ─ 7: Thumb, index, middle with ring touching thumb ─
  {
    id: '7', label: '7', category: 'number', emoji: '🤞', twoHanded: false,
    description: '✅ Single-handed: Ring finger touches thumb, other three extended',
    instruction: 'Touch ring finger tip to thumb tip. Extend index, middle and pinky fingers.',
    fingerStates: ['bent', 'extended', 'extended', 'bent', 'extended'],
  },
  // ─ 8: Middle finger touches thumb, others extended ─
  {
    id: '8', label: '8', category: 'number', emoji: '🤌', twoHanded: false,
    description: '✅ Single-handed: Middle finger touches thumb, index, ring, pinky extended',
    instruction: 'Touch middle finger tip to thumb tip. Extend index, ring and pinky fingers outward.',
    fingerStates: ['bent', 'extended', 'bent', 'extended', 'extended'],
  },
  // ─ 9: Index touches thumb (OK sign), others curled ─
  {
    id: '9', label: '9', category: 'number', emoji: '👌', twoHanded: false,
    description: '✅ Single-handed: Index finger and thumb touch forming a circle, others extended',
    instruction: 'Touch index fingertip to thumb tip (OK sign). Extend middle, ring and pinky fingers.',
    fingerStates: ['bent', 'bent', 'extended', 'extended', 'extended'],
  },
  // ─ 10: Two-handed (chart shows thumbs up on both hands) ─
  {
    id: '10', label: '10', category: 'number', emoji: '🤲', twoHanded: true,
    description: '⚠️ Two-handed: Both hands show thumbs up (or 1+0)',
    instruction: 'Raise both thumbs up simultaneously, or show 1 with one hand and 0 with the other.',
    fingerStates: ['any', 'any', 'any', 'any', 'any'],
  },
];

// ── ISL GREETINGS ─────────────────────────────────────────────────────────────
// PENDING: Greetings removed until a verified ISL greetings chart is provided.
// Share an official ISL greetings chart image to add accurate signs here.

export const ISL_GREETINGS: ISLSign[] = [
  // Add verified ISL greetings here after chart is provided
];

const _UNUSED_GREETINGS_PLACEHOLDER: ISLSign[] = [
  {
    id: 'hello', label: 'Hello', category: 'greeting', emoji: '👋', twoHanded: false,
    description: '✅ Single-handed: Open flat hand wave',
    instruction: 'Hold hand flat with all five fingers together. Wave it gently side to side near your face.',
    fingerStates: ['extended', 'extended', 'extended', 'extended', 'extended'],
  },
  {
    id: 'thank-you', label: 'Thank You', category: 'greeting', emoji: '🙏', twoHanded: false,
    description: '✅ Single-handed: Flat hand touches chin and moves forward',
    instruction: 'Touch your flat open hand to your chin, then move it forward and slightly down away from your face.',
    fingerStates: ['extended', 'extended', 'extended', 'extended', 'extended'],
  },
  {
    id: 'please', label: 'Please', category: 'greeting', emoji: '🤲', twoHanded: false,
    description: '✅ Single-handed: Flat hand circles on chest',
    instruction: 'Place your flat open hand on your chest and rub it in a circular motion.',
    fingerStates: ['extended', 'extended', 'extended', 'extended', 'extended'],
  },
  {
    id: 'sorry', label: 'Sorry', category: 'greeting', emoji: '✊', twoHanded: false,
    description: '✅ Single-handed: Closed fist rubs in circles on chest',
    instruction: 'Make a fist and rub it in circular motions on your chest.',
    fingerStates: ['curled', 'curled', 'curled', 'curled', 'curled'],
  },
  {
    id: 'yes', label: 'Yes', category: 'greeting', emoji: '✊', twoHanded: false,
    description: '✅ Single-handed: Fist nods up and down',
    instruction: 'Make a fist and nod it up and down twice, like a head nodding yes.',
    fingerStates: ['curled', 'curled', 'curled', 'curled', 'curled'],
  },
  {
    id: 'no', label: 'No', category: 'greeting', emoji: '✌️', twoHanded: false,
    description: '✅ Single-handed: Index and middle tap together twice',
    instruction: 'Extend index and middle fingers. Tap them together twice quickly.',
    fingerStates: ['curled', 'extended', 'extended', 'curled', 'curled'],
  },
  {
    id: 'good', label: 'Good', category: 'greeting', emoji: '👍', twoHanded: false,
    description: '✅ Single-handed: Thumbs up',
    instruction: 'Make a fist with thumb pointing straight up. Move it slightly forward.',
    fingerStates: ['extended', 'curled', 'curled', 'curled', 'curled'],
  },
  {
    id: 'bad', label: 'Bad', category: 'greeting', emoji: '👎', twoHanded: false,
    description: '✅ Single-handed: Thumbs down',
    instruction: 'Make a fist with thumb pointing straight down.',
    fingerStates: ['extended', 'curled', 'curled', 'curled', 'curled'],
  },
  {
    id: 'help', label: 'Help', category: 'greeting', emoji: '🤝', twoHanded: false,
    description: '✅ Single-handed: Thumbs up fist lifted upward',
    instruction: 'Make a thumbs up fist and lift it upward with a small motion.',
    fingerStates: ['extended', 'curled', 'curled', 'curled', 'curled'],
  },
  {
    id: 'water', label: 'Water', category: 'greeting', emoji: '💧', twoHanded: false,
    description: '✅ Single-handed: W handshape (3 fingers) taps chin twice',
    instruction: 'Extend index, middle and ring fingers spread (W shape). Tap your chin twice with the index finger side.',
    fingerStates: ['curled', 'extended', 'extended', 'extended', 'curled'],
  },
];

// ── EXPORTS ───────────────────────────────────────────────────────────────────

export const ALL_SIGNS: ISLSign[] = [
  ...ISL_ALPHABET,
  ...ISL_NUMBERS,
  // ISL_GREETINGS intentionally empty until verified chart is provided
];

export const SINGLE_HAND_SIGNS = ALL_SIGNS.filter(s => !s.twoHanded);
export const TWO_HAND_SIGNS = ALL_SIGNS.filter(s => s.twoHanded);

export function getSignById(id: string): ISLSign | undefined {
  return ALL_SIGNS.find(s => s.id === id);
}

export function getSignsByCategory(category: ISLSign['category']): ISLSign[] {
  return ALL_SIGNS.filter(s => s.category === category);
}

export const ISL_STATS = {
  total: ALL_SIGNS.length,
  singleHanded: SINGLE_HAND_SIGNS.length,
  twoHanded: TWO_HAND_SIGNS.length,
  alphabetSingleHanded: ISL_ALPHABET.filter(s => !s.twoHanded).length,
  alphabetTwoHanded: ISL_ALPHABET.filter(s => s.twoHanded).length,
};