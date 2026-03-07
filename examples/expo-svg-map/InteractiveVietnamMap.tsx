import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type ProvinceStatus = 'locked' | 'discover' | 'visited' | 'verified';

type ProvinceShape = {
  id: string;
  name: string;
  status: ProvinceStatus;
  path: string;
};

const PROVINCES: ProvinceShape[] = [
  {
    id: 'hagiang',
    name: 'Hà Giang',
    status: 'discover',
    path: 'M160 40 L245 56 L228 122 L148 114 Z',
  },
  {
    id: 'hanoi',
    name: 'Hà Nội',
    status: 'visited',
    path: 'M190 132 L248 140 L236 188 L182 184 Z',
  },
  {
    id: 'danang',
    name: 'Đà Nẵng',
    status: 'verified',
    path: 'M218 274 L274 286 L264 340 L212 334 Z',
  },
  {
    id: 'quangnam',
    name: 'Quảng Nam',
    status: 'discover',
    path: 'M214 342 L278 352 L264 412 L206 406 Z',
  },
  {
    id: 'khanhhoa',
    name: 'Khánh Hòa',
    status: 'locked',
    path: 'M232 454 L294 468 L278 542 L218 530 Z',
  },
  {
    id: 'hochiminh',
    name: 'TP. Hồ Chí Minh',
    status: 'visited',
    path: 'M182 628 L252 638 L238 700 L174 692 Z',
  },
  {
    id: 'angiang',
    name: 'An Giang',
    status: 'verified',
    path: 'M116 706 L176 716 L166 770 L110 760 Z',
  },
  {
    id: 'kiengiang',
    name: 'Kiên Giang',
    status: 'discover',
    path: 'M78 758 L146 772 L132 826 L64 812 Z',
  },
];

const STATUS_COLORS: Record<ProvinceStatus, string> = {
  locked: '#E2E8F0',
  discover: '#BEE3F8',
  visited: '#86EFAC',
  verified: '#FDE68A',
};

const AnimatedView = Animated.createAnimatedComponent(View);

export default function InteractiveVietnamMap() {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('danang');
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const selectedProvince = useMemo(
    () => PROVINCES.find((province) => province.id === selectedProvinceId),
    [selectedProvinceId]
  );

  const pinchGesture = Gesture.Pinch().onUpdate((event) => {
    const nextScale = Math.min(3, Math.max(0.9, event.scale));
    scale.value = nextScale;
  });

  const panGesture = Gesture.Pan().onUpdate((event) => {
    translateX.value = event.translationX;
    translateY.value = event.translationY;
  });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedMapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(translateX.value, { duration: 50 }) },
      { translateY: withTiming(translateY.value, { duration: 50 }) },
      { scale: withTiming(scale.value, { duration: 50 }) },
    ],
  }));

  const zoomIn = () => {
    scale.value = Math.min(3, scale.value + 0.25);
  };

  const zoomOut = () => {
    scale.value = Math.max(0.9, scale.value - 0.25);
  };

  const resetView = () => {
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>VietWander Map</Text>
        <Text style={styles.subtitle}>Tap tỉnh để mở preview, pinch để zoom.</Text>
      </View>

      <GestureDetector gesture={composedGesture}>
        <AnimatedView style={[styles.mapFrame, animatedMapStyle]}>
          <Svg width="100%" height="100%" viewBox="0 0 360 860">
            <Path
              d="M150 22 L252 42 L270 92 L252 160 L286 286 L296 354 L286 426 L300 526 L260 630 L228 718 L146 834 L86 820 L100 742 L168 694 L192 638 L240 544 L252 466 L224 338 L214 218 L176 122 L150 22 Z"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth={8}
            />

            {PROVINCES.map((province) => {
              const selected = province.id === selectedProvinceId;

              return (
                <Path
                  key={province.id}
                  d={province.path}
                  fill={selected ? '#FB7185' : STATUS_COLORS[province.status]}
                  stroke={selected ? '#9F1239' : '#475569'}
                  strokeWidth={selected ? 6 : 4}
                  onPress={() => setSelectedProvinceId(province.id)}
                />
              );
            })}
          </Svg>
        </AnimatedView>
      </GestureDetector>

      <View style={styles.controlRow}>
        <ControlButton label="-" onPress={zoomOut} />
        <ControlButton label="Reset" onPress={resetView} compact />
        <ControlButton label="+" onPress={zoomIn} />
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.sheetLabel}>Tỉnh đang chọn</Text>
        <Text style={styles.sheetTitle}>{selectedProvince?.name ?? 'Chưa chọn'}</Text>
        <View style={styles.badgeRow}>
          <StatusBadge label="Khóa" color={STATUS_COLORS.locked} />
          <StatusBadge label="Muốn đi" color={STATUS_COLORS.discover} />
          <StatusBadge label="Đã đi" color={STATUS_COLORS.visited} />
          <StatusBadge label="Verified" color={STATUS_COLORS.verified} />
        </View>
        <Text style={styles.sheetBody}>
          Dùng file SVG export từ Figma hoặc Illustrator rồi thay mảng <Text style={styles.inlineCode}>PROVINCES</Text> bằng đủ 63 tỉnh để đưa vào app thật.
        </Text>
      </View>
    </View>
  );
}

function ControlButton({
  label,
  onPress,
  compact = false,
}: {
  label: string;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.controlButton, compact && styles.compactButton]}>
      <Text style={styles.controlText}>{label}</Text>
    </Pressable>
  );
}

function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <View style={styles.statusBadge}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={styles.statusLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 58,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#475569',
  },
  mapFrame: {
    marginHorizontal: 16,
    height: 520,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    overflow: 'hidden',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  controlButton: {
    minWidth: 52,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
  },
  compactButton: {
    minWidth: 86,
  },
  controlText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomSheet: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sheetLabel: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sheetTitle: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  sheetBody: {
    marginTop: 14,
    color: '#475569',
    lineHeight: 22,
    fontSize: 14,
  },
  inlineCode: {
    fontFamily: 'monospace',
    color: '#0F172A',
  },
});
