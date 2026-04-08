import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { generateLogicBasedReport } from '../features/styleAnalysis/generateLogicBasedReport';
import type {
  BodyShape,
  LineAnswer,
  QuestionnaireData,
  ScaleAnswer,
} from '../features/styleAnalysis/types';

type Step = 0 | 1 | 2 | 3;

const stepTitles: string[] = [
  'Line Analysis (Part 1)',
  'Line Analysis (Part 2)',
  'Scale Assessment',
  'Horizontal Proportion (Body Shape)',
];

type QuestionnaireFormState = {
  shoulders_answer?: string;
  waist_answer?: string;
  hips_answer?: string;
  face_answer?: string;
  jawline_answer?: string;
  wrist_answer?: string;
  height_answer?: string;
  shoeSize_answer?: string;
  bodyShape?: BodyShape;
};

const lineOptions = {
  shoulders: [
    { value: 'straight', label: 'Straight', classification: 'straight' as const },
    { value: 'sloping', label: 'Sloping', classification: 'curved' as const },
  ],
  waist: [
    { value: 'defined', label: 'Defined', classification: 'curved' as const },
    { value: 'undefined', label: 'Undefined', classification: 'straight' as const },
  ],
  hips: [
    { value: 'flared', label: 'Flared', classification: 'curved' as const },
    { value: 'straight', label: 'Straight', classification: 'straight' as const },
  ],
  face: [
    { value: 'straight/thin lips', label: 'Straight/thin lips', classification: 'straight' as const },
    { value: 'curved/full lips', label: 'Curved/full lips', classification: 'curved' as const },
  ],
  jawline: [
    { value: 'curved', label: 'Curved', classification: 'curved' as const },
    { value: 'angular', label: 'Angular', classification: 'straight' as const },
  ],
} as const;

const scaleOptions = {
  wrist: [
    { value: 'Small - 5.5” (14cm) or less', label: 'Small - 5.5” (14cm) or less' },
    { value: 'Medium - 5.5 – 6.5” (14-16cm)', label: 'Medium - 5.5 – 6.5” (14-16cm)' },
    { value: 'Large 6.5 (16.5cm) or more', label: 'Large 6.5 (16.5cm) or more' },
  ],
  height: [
    { value: "Small - Under 5’3” (1.6m)", label: "Small - Under 5’3” (1.6m)" },
    { value: 'Medium - 5’3” – 5’8” (1.6-1.72m)', label: 'Medium - 5’3” – 5’8” (1.6-1.72m)' },
    { value: 'Large – 5’8” (1.72m) and over', label: 'Large – 5’8” (1.72m) and over' },
  ],
  shoeSize: [
    { value: 'Small – 35 – 37', label: 'Small – 35 – 37' },
    { value: 'Medium – 38 - 39', label: 'Medium – 38 - 39' },
    { value: 'Large – 40+', label: 'Large – 40+' },
  ],
} as const;

const bodyShapeOptions: Array<{ name: BodyShape; description: string }> = [
  {
    name: 'Pear Shape',
    description:
      'Smaller upper body with narrow shoulders and/or a petite bust. The waist is defined, leading to broader hips.',
  },
  {
    name: 'Inverted Triangle',
    description:
      'Shoulders are wider than the hips, often accompanied by a fuller bust and a shorter waist.',
  },
  {
    name: 'Straight',
    description:
      'Hips and shoulders are aligned with little to no waist definition, creating a straight silhouette.',
  },
  {
    name: 'Round/Apple',
    description:
      'Fullness throughout with a less defined waist, creating a naturally curvy outline.',
  },
  {
    name: 'Hourglass',
    description:
      'Balanced proportions between shoulders and hips with a well-defined waist (atleast 10 inches smaller than shoulders/hips).',
  },
];

function getClassification(bodyPart: keyof typeof lineOptions, answer: string): LineAnswer['classification'] {
  const option = lineOptions[bodyPart].find((opt) => opt.value === answer);
  return option ? option.classification : 'straight';
}

function OptionChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.chip, selected ? styles.chipSelected : styles.chipUnselected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected ? styles.chipTextSelected : styles.chipTextDefault]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function StyleAnalysisScreen() {
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<QuestionnaireFormState>({});
  const [report, setReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const progress = useMemo(() => ((step + 1) / 4) * 100, [step]);

  function setAnswer<K extends keyof QuestionnaireFormState>(key: K, value: QuestionnaireFormState[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function validateCurrentStep(): boolean {
    if (step === 0) {
      if (!answers.shoulders_answer || !answers.waist_answer || !answers.hips_answer) return false;
    }
    if (step === 1) {
      if (!answers.face_answer || !answers.jawline_answer) return false;
    }
    if (step === 2) {
      if (!answers.wrist_answer || !answers.height_answer || !answers.shoeSize_answer) return false;
    }
    if (step === 3) {
      if (!answers.bodyShape) return false;
    }
    return true;
  }

  function buildQuestionnaireData(): QuestionnaireData {
    if (!answers.bodyShape) throw new Error('Missing body shape');

    const lineAnswers: LineAnswer[] = [
      {
        bodyPart: 'Shoulders',
        answer: answers.shoulders_answer || '',
        classification: getClassification('shoulders', answers.shoulders_answer || ''),
      },
      {
        bodyPart: 'Waist',
        answer: answers.waist_answer || '',
        classification: getClassification('waist', answers.waist_answer || ''),
      },
      {
        bodyPart: 'Hips',
        answer: answers.hips_answer || '',
        classification: getClassification('hips', answers.hips_answer || ''),
      },
      {
        bodyPart: 'Face',
        answer: answers.face_answer || '',
        classification: getClassification('face', answers.face_answer || ''),
      },
      {
        bodyPart: 'Jawline',
        answer: answers.jawline_answer || '',
        classification: getClassification('jawline', answers.jawline_answer || ''),
      },
    ];

    const scaleAnswers: ScaleAnswer[] = [
      { category: 'Wrist Circumference', answer: answers.wrist_answer || '' },
      { category: 'Height', answer: answers.height_answer || '' },
      { category: 'Shoe Size', answer: answers.shoeSize_answer || '' },
    ];

    return {
      lineAnswers,
      scaleAnswers,
      bodyShape: answers.bodyShape,
    };
  }

  async function onProceed() {
    if (report) return;
    if (!validateCurrentStep()) {
      Alert.alert('Missing answers', 'Please select an option for the questions on this step.');
      return;
    }

    if (step < 3) {
      setStep((prev) => ((prev + 1) as Step));
      return;
    }

    setIsGenerating(true);
    try {
      const data = buildQuestionnaireData();
      const generated = generateLogicBasedReport(data);
      setReport(generated);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not generate your report.';
      Alert.alert('Error', message);
    } finally {
      setIsGenerating(false);
    }
  }

  function onBack() {
    if (report) return;
    if (step > 0) setStep((prev) => ((prev - 1) as Step));
  }

  if (report) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Your Style Report</Text>
        <Text style={styles.body}>
          Based on your answers, here’s your logic-based recommendation (no payment/email step in
          the native demo).
        </Text>

        <View style={styles.reportShell}>
          <ScrollView style={{ maxHeight: 620 }} nestedScrollEnabled>
            <Text selectable style={styles.reportText}>
              {report}
            </Text>
          </ScrollView>
        </View>

        <Pressable style={[styles.primaryButton]} onPress={() => {
          setReport(null);
          setIsGenerating(false);
          setStep(0);
          setAnswers({});
        }}>
          <Text style={styles.primaryButtonText}>Edit answers</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Style analysis</Text>
      <Text style={styles.body}>Answer a few questions to get personalised styling guidance. </Text>

      <View style={styles.progressShell}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.stepTitle}>{stepTitles[step]}</Text>

      {step === 0 ? (
        <View style={styles.stepBlock}>
          <Text style={styles.questionLabel}>Shoulders</Text>
          <View style={styles.chipRow}>
            {lineOptions.shoulders.map((opt) => (
              <OptionChip
                key={opt.value}
                label={opt.label}
                selected={answers.shoulders_answer === opt.value}
                onPress={() => setAnswer('shoulders_answer', opt.value)}
              />
            ))}
          </View>

          <Text style={styles.questionLabel}>Waist</Text>
          <View style={styles.chipRow}>
            {lineOptions.waist.map((opt) => (
              <OptionChip
                key={opt.value}
                label={opt.label}
                selected={answers.waist_answer === opt.value}
                onPress={() => setAnswer('waist_answer', opt.value)}
              />
            ))}
          </View>

          <Text style={styles.questionLabel}>Hips</Text>
          <View style={styles.chipRow}>
            {lineOptions.hips.map((opt) => (
              <OptionChip
                key={opt.value}
                label={opt.label}
                selected={answers.hips_answer === opt.value}
                onPress={() => setAnswer('hips_answer', opt.value)}
              />
            ))}
          </View>
        </View>
      ) : null}

      {step === 1 ? (
        <View style={styles.stepBlock}>
          <Text style={styles.questionLabel}>Face (Lips)</Text>
          <View style={styles.chipRow}>
            {lineOptions.face.map((opt) => (
              <OptionChip
                key={opt.value}
                label={opt.label}
                selected={answers.face_answer === opt.value}
                onPress={() => setAnswer('face_answer', opt.value)}
              />
            ))}
          </View>

          <Text style={styles.questionLabel}>Jawline</Text>
          <View style={styles.chipRow}>
            {lineOptions.jawline.map((opt) => (
              <OptionChip
                key={opt.value}
                label={opt.label}
                selected={answers.jawline_answer === opt.value}
                onPress={() => setAnswer('jawline_answer', opt.value)}
              />
            ))}
          </View>
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.stepBlock}>
          <Text style={styles.questionLabel}>Wrist Circumference</Text>
          <Text style={styles.questionHint}>
            Measure the diameter of the smallest part of your wrist
          </Text>
          <View style={styles.chipRow}>
            {scaleOptions.wrist.map((opt) => (
              <OptionChip
                key={opt.value}
                label={opt.label}
                selected={answers.wrist_answer === opt.value}
                onPress={() => setAnswer('wrist_answer', opt.value)}
              />
            ))}
          </View>

          <Text style={styles.questionLabel}>Height</Text>
          <View style={styles.chipRow}>
            {scaleOptions.height.map((opt) => (
              <OptionChip
                key={opt.value}
                label={opt.label}
                selected={answers.height_answer === opt.value}
                onPress={() => setAnswer('height_answer', opt.value)}
              />
            ))}
          </View>

          <Text style={styles.questionLabel}>Shoe Size</Text>
          <View style={styles.chipRow}>
            {scaleOptions.shoeSize.map((opt) => (
              <OptionChip
                key={opt.value}
                label={opt.label}
                selected={answers.shoeSize_answer === opt.value}
                onPress={() => setAnswer('shoeSize_answer', opt.value)}
              />
            ))}
          </View>
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.stepBlock}>
          {bodyShapeOptions.map((opt) => (
            <Pressable
              key={opt.name}
              style={[
                styles.bodyShapeCard,
                answers.bodyShape === opt.name ? styles.bodyShapeCardSelected : null,
              ]}
              onPress={() => setAnswer('bodyShape', opt.name)}
            >
              <Text style={[styles.bodyShapeTitle, answers.bodyShape === opt.name ? styles.bodyShapeTitleSelected : null]}>
                {opt.name}
              </Text>
              <Text style={styles.bodyShapeDescription}>{opt.description}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.footerRow}>
        <Pressable
          style={[styles.secondaryButton, step === 0 ? styles.disabledButton : null]}
          onPress={onBack}
          disabled={step === 0 || isGenerating}
        >
          <Text style={styles.secondaryButtonText}>Previous</Text>
        </Pressable>

        <Pressable
          style={[styles.primaryButton, isGenerating ? styles.disabledButton : null]}
          onPress={onProceed}
          disabled={isGenerating}
        >
          <Text style={styles.primaryButtonText}>
            {isGenerating ? 'Generating…' : step < 3 ? 'Next' : 'Proceed to get report'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 34,
    backgroundColor: '#0b1220',
  },
  title: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
  },
  body: {
    color: '#cbd5e1',
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
  },
  progressShell: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(148,163,184,0.25)',
    marginTop: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
  stepTitle: {
    marginTop: 14,
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '900',
  },
  stepBlock: {
    marginTop: 12,
    gap: 14,
  },
  questionLabel: {
    color: 'rgba(248,250,252,0.9)',
    fontSize: 13,
    fontWeight: '800',
  },
  questionHint: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: -8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipUnselected: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(148,163,184,0.35)',
  },
  chipSelected: {
    backgroundColor: 'rgba(99,102,241,0.25)',
    borderColor: 'rgba(99,102,241,0.85)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '800',
  },
  chipTextDefault: {
    color: '#e5e7eb',
  },
  chipTextSelected: {
    color: '#f8fafc',
  },
  bodyShapeCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 12,
    gap: 6,
  },
  bodyShapeCardSelected: {
    borderColor: 'rgba(99,102,241,0.9)',
    backgroundColor: 'rgba(99,102,241,0.18)',
  },
  bodyShapeTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '900',
  },
  bodyShapeTitleSelected: {
    color: '#ffffff',
  },
  bodyShapeDescription: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: '#6366f1',
    borderWidth: 1,
    borderColor: '#6366f1',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#f8fafc',
    fontWeight: '900',
    fontSize: 13,
  },
  secondaryButton: {
    width: 130,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#cbd5e1',
    fontWeight: '900',
    fontSize: 13,
  },
  disabledButton: {
    opacity: 0.55,
  },
  reportShell: {
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 12,
  },
  reportText: {
    color: 'rgba(248,250,252,0.95)',
    fontSize: 13,
    lineHeight: 18,
  },
});

