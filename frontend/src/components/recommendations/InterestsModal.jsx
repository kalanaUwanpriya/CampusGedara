import { useEffect, useState } from 'react';
import { Sparkles, X, ChevronRight, ChevronLeft, BookOpen, Camera, Trophy, Heart, Clock, Star, CalendarDays } from 'lucide-react';

const INTERESTS_KEY = 'campusgedara_interests';

const readInterests = () => {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(INTERESTS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const writeInterests = (next) => {
    window.localStorage.setItem(INTERESTS_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('campusgedara:interestsUpdated'));
};

const STEPS = [
    {
        id: 1,
        title: 'Event Category',
        subtitle: 'What kind of event are you looking for?',
        Icon: Trophy,
        iconBg: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
        iconColor: '#4f46e5',
        accentColor: '#4f46e5',
        nextBtnStyle: { background: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
        topics: [
            { id: 'cultural', label: 'Cultural', sub: 'Arts, Heritage' },
            { id: 'sports', label: 'Sports', sub: 'Athletics, Matches' },
            { id: 'entertainment', label: 'Entertainment', sub: 'Shows, Performances' },
            { id: 'tech-education', label: 'Tech / Education', sub: 'Workshops, Seminars' },
        ],
    },
    {
        id: 2,
        title: 'Participation & Timing',
        subtitle: 'When and who can join?',
        Icon: Clock,
        iconBg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
        iconColor: '#ec4899',
        accentColor: '#ec4899',
        nextBtnStyle: { background: 'linear-gradient(135deg, #f472b6, #ec4899)' },
        topics: [
            { id: 'day', label: 'Day', sub: 'Morning to Afternoon' },
            { id: 'night', label: 'Night', sub: 'Evening onwards' },
            { id: 'full-day', label: 'Full Day', sub: 'All day event' },
            { id: 'open-to-all', label: 'Open to All Students', sub: 'General Audience' },
            { id: 'special-groups', label: 'Special Groups', sub: 'Clubs or Faculties' },
        ],
    },
    {
        id: 3,
        title: 'Event Nature',
        subtitle: 'Why the event exists',
        Icon: Star,
        iconBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        iconColor: '#f59e0b',
        accentColor: '#f59e0b',
        nextBtnStyle: { background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
        topics: [
            { id: 'special-event', label: 'Special Event', sub: 'One-time Occasion' },
            { id: 'annual-event', label: 'Annual Event', sub: 'Yearly Tradition' },
            { id: 'environmental', label: 'Environmental', sub: 'Sustainability' },
            { id: 'it-tech', label: 'IT / Tech', sub: 'Computing, Software' },
            { id: 'business', label: 'Business', sub: 'Entrepreneurship' },
            { id: 'engineering', label: 'Engineering', sub: 'Design, Build' },
        ],
    },
    {
        id: 4,
        title: 'Interest Areas',
        subtitle: 'What do you like?',
        Icon: Heart,
        iconBg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        iconColor: '#10b981',
        accentColor: '#10b981',
        nextBtnStyle: { background: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
        topics: [
            { id: 'music', label: 'Music', sub: 'Listen & Perform' },
            { id: 'dancing', label: 'Dancing', sub: 'Choreography' },
            { id: 'photography', label: 'Photography', sub: 'Visual Arts' },
            { id: 'service', label: 'Service / Volunteering', sub: 'Help the Community' },
            { id: 'adventure', label: 'Adventure', sub: 'Outdoors, Thrill' },
        ],
    },
];

const InterestsModal = () => {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState({});

    useEffect(() => {
        // Prevent auto-open on mount.
        // Modal will only open when the floating button is clicked.
    }, []);

    const currentStep = STEPS[step];
    const totalSteps = STEPS.length;
    const selectedCount = currentStep.topics.filter(t => selections[t.id]).length;

    const toggleTopic = (topicId) => {
        setSelections(prev => ({ ...prev, [topicId]: !prev[topicId] }));
    };

    const handleNext = () => {
        if (step < totalSteps - 1) {
            setStep(s => s + 1);
        } else {
            const chosen = Object.keys(selections).filter(k => selections[k]);
            writeInterests(chosen.length > 0 ? chosen : ['technology']);
            setOpen(false);
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(s => s - 1);
    };

    const handleSkip = () => {
        writeInterests([]);
        setOpen(false);
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                style={styles.floatingBtn}
                title="Personalize Recommendations"
            >
                <Sparkles style={{ width: 24, height: 24, color: '#ffffff' }} />
            </button>
        );
    }

    const { title, subtitle, Icon, iconBg, iconColor, accentColor, nextBtnStyle, topics } = currentStep;
    const isLast = step === totalSteps - 1;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.headerLeft}>
                        <Sparkles style={{ width: 18, height: 18, color: '#6366f1', flexShrink: 0 }} />
                        <span style={styles.headerTitle}>Personalize Your Experience</span>
                    </div>
                    <button onClick={handleSkip} style={styles.closeBtn} aria-label="Close">
                        <X style={{ width: 18, height: 18 }} />
                    </button>
                </div>

                <p style={styles.headerSub}>
                    Select a few topics to help us recommend the best events and clubs for you.
                </p>

                {/* Progress Bar */}
                <div style={styles.progressRow}>
                    <div style={styles.progressBarContainer}>
                        {STEPS.map((s, i) => (
                            <div
                                key={s.id}
                                style={{
                                    ...styles.progressSegment,
                                    background: i <= step ? '#6366f1' : '#e2e8f0',
                                }}
                            />
                        ))}
                    </div>
                    <div style={styles.progressMeta}>
                        <span style={styles.stepLabel}>STEP {step + 1} OF {totalSteps}</span>
                        <span style={{ ...styles.selectedCount, color: accentColor }}>
                            {selectedCount} Selected
                        </span>
                    </div>
                </div>

                {/* Category Header */}
                <div style={styles.categoryHeader}>
                    <div style={{ ...styles.categoryIcon, background: iconBg }}>
                        <Icon style={{ width: 22, height: 22, color: iconColor }} />
                    </div>
                    <div>
                        <div style={styles.categoryTitle}>{title}</div>
                        <div style={styles.categorySubtitle}>{subtitle}</div>
                    </div>
                </div>

                {/* Topics Grid */}
                <div style={styles.topicsGrid}>
                    {topics.map((topic) => {
                        const isSelected = !!selections[topic.id];
                        return (
                            <button
                                key={topic.id}
                                onClick={() => toggleTopic(topic.id)}
                                style={{
                                    ...styles.topicCard,
                                    ...(isSelected ? {
                                        borderColor: accentColor,
                                        background: `${accentColor}10`,
                                    } : {}),
                                }}
                            >
                                <div style={styles.topicCardInner}>
                                    <div>
                                        <div style={styles.topicLabel}>{topic.label}</div>
                                        <div style={styles.topicSub}>{topic.sub}</div>
                                    </div>
                                    <div style={{
                                        ...styles.radioOuter,
                                        borderColor: isSelected ? accentColor : '#cbd5e1',
                                    }}>
                                        {isSelected && (
                                            <div style={{ ...styles.radioDot, background: accentColor }} />
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    <button onClick={handleSkip} style={styles.skipBtn}>Skip for now</button>
                    <div style={styles.footerActions}>
                        {step > 0 && (
                            <button onClick={handleBack} style={styles.backBtn}>
                                <ChevronLeft style={{ width: 16, height: 16 }} />
                                Back
                            </button>
                        )}
                        <button onClick={handleNext} style={{ ...styles.nextBtn, ...nextBtnStyle }}>
                            {isLast ? (
                                <>See Recommendations Options <Sparkles style={{ width: 16, height: 16 }} /></>
                            ) : (
                                <>Next Step <ChevronRight style={{ width: 16, height: 16 }} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    floatingBtn: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
        boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: 'none',
        zIndex: 9999,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
    },
    modal: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '28px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '6px',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    headerTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#111827',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#6b7280',
        padding: '4px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
    },
    headerSub: {
        fontSize: '13px',
        color: '#6b7280',
        margin: '0 0 16px 0',
    },
    progressRow: {
        marginBottom: '20px',
    },
    progressBarContainer: {
        display: 'flex',
        gap: '6px',
        marginBottom: '6px',
    },
    progressSegment: {
        flex: 1,
        height: '5px',
        borderRadius: '100px',
        transition: 'background 0.3s ease',
    },
    progressMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stepLabel: {
        fontSize: '11px',
        fontWeight: '600',
        color: '#9ca3af',
        letterSpacing: '0.05em',
    },
    selectedCount: {
        fontSize: '11px',
        fontWeight: '700',
    },
    categoryHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '18px',
    },
    categoryIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    categoryTitle: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#111827',
        lineHeight: 1.2,
    },
    categorySubtitle: {
        fontSize: '13px',
        color: '#6b7280',
        marginTop: '2px',
    },
    topicsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '24px',
    },
    topicCard: {
        background: '#f8fafc',
        border: '1.5px solid #e2e8f0',
        borderRadius: '12px',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        textAlign: 'left',
    },
    topicCardInner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
    },
    topicLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#111827',
    },
    topicSub: {
        fontSize: '12px',
        color: '#9ca3af',
        marginTop: '2px',
    },
    radioOuter: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        border: '2px solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'border-color 0.15s ease',
    },
    radioDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    skipBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#6b7280',
        padding: '8px 0',
        fontWeight: '500',
    },
    footerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '10px 18px',
        borderRadius: '10px',
        border: '1.5px solid #e2e8f0',
        background: '#ffffff',
        color: '#374151',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
    },
    nextBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 22px',
        borderRadius: '10px',
        border: 'none',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'opacity 0.15s ease',
        boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
    },
};

export default InterestsModal;
