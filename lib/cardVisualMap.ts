export interface CardVisualDefinition {
  imageUrl: string;
  imageAlt: string;
  visualTheme: string;
  visualPrompt?: string;
  legacyImageUrl?: string;
}

export const CARD_VISUALS: Record<string, CardVisualDefinition> = {
  "late-night-highway": {
    "imageUrl": "/images/cards/late-night-highway.jpg",
    "imageAlt": "Late-night highway: Empty roads, heavy thoughts",
    "visualTheme": "night-drive",
    "legacyImageUrl": "/vibes/tokyo-night-drive.png"
  },
  "coffee-shop": {
    "imageUrl": "/images/cards/coffee-shop.jpg",
    "imageAlt": "Coffee shop: Soft focus mode",
    "visualTheme": "rainy-cafe",
    "legacyImageUrl": "/vibes/rainy-cafe-focus.png"
  },
  "rainy-days": {
    "imageUrl": "/images/cards/rainy-days.jpg",
    "imageAlt": "Rainy days: Melancholy but cozy",
    "visualTheme": "rainy-cafe",
    "legacyImageUrl": "/vibes/rainy-cafe-focus.png"
  },
  "beach-sunset": {
    "imageUrl": "/images/cards/beach-sunset.jpg",
    "imageAlt": "Beach sunset: Warm, open, relaxed",
    "visualTheme": "beach-sunset",
    "legacyImageUrl": "/vibes/soft-beach-sunset.png"
  },
  "restless-energy": {
    "imageUrl": "/images/cards/restless-energy.jpg",
    "imageAlt": "Restless energy: You need motion",
    "visualTheme": "mystery-neon"
  },
  "dark-rooms": {
    "imageUrl": "/images/cards/dark-rooms.jpg",
    "imageAlt": "Dark rooms: Moody and cinematic",
    "visualTheme": "dark-club",
    "legacyImageUrl": "/vibes/dark-club-silhouettes.png"
  },
  "dance-floor": {
    "imageUrl": "/images/cards/dance-floor.jpg",
    "imageAlt": "Dance floor: You want movement",
    "visualTheme": "dark-club",
    "legacyImageUrl": "/vibes/dark-club-silhouettes.png"
  },
  "deep-work": {
    "imageUrl": "/images/cards/deep-work.jpg",
    "imageAlt": "Deep work: No lyrics, just flow",
    "visualTheme": "instrumental-focus"
  },
  "main-character": {
    "imageUrl": "/images/cards/main-character.jpg",
    "imageAlt": "Main character: You want drama",
    "visualTheme": "main-character"
  },
  "rage-cleaning": {
    "imageUrl": "/images/cards/rage-cleaning.jpg",
    "imageAlt": "Rage cleaning: Productive chaos",
    "visualTheme": "rage-cleaning",
    "legacyImageUrl": "/vibes/rage-cleaning.png"
  },
  "heartbreak-montage": {
    "imageUrl": "/images/cards/heartbreak-montage.jpg",
    "imageAlt": "Heartbreak montage: Sad but beautiful",
    "visualTheme": "heartbreak"
  },
  "feeling-expensive": {
    "imageUrl": "/images/cards/feeling-expensive.jpg",
    "imageAlt": "Feeling expensive: Luxury confidence",
    "visualTheme": "beach-sunset",
    "legacyImageUrl": "/vibes/soft-beach-sunset.png"
  },
  "road-trip": {
    "imageUrl": "/images/cards/road-trip.jpg",
    "imageAlt": "Road trip: Forward motion",
    "visualTheme": "main-character"
  },
  "walking-fast": {
    "imageUrl": "/images/cards/walking-fast.jpg",
    "imageAlt": "Walking fast, ignoring texts: Places to be, peace to keep",
    "visualTheme": "main-character"
  },
  "spicy-food": {
    "imageUrl": "/images/cards/spicy-food.jpg",
    "imageAlt": "Spicy food: You like intensity",
    "visualTheme": "mystery-neon"
  },
  "boxing": {
    "imageUrl": "/images/cards/boxing.jpg",
    "imageAlt": "Boxing: Focused aggression",
    "visualTheme": "gym-power",
    "legacyImageUrl": "/vibes/gym-villain-arc.png"
  },
  "heavy-bass": {
    "imageUrl": "/images/cards/heavy-bass.jpg",
    "imageAlt": "Heavy bass: Feel it in your chest",
    "visualTheme": "dark-club",
    "legacyImageUrl": "/vibes/dark-club-silhouettes.png"
  },
  "fast-drums": {
    "imageUrl": "/images/cards/fast-drums.jpg",
    "imageAlt": "Fast drums: Rhythm first, everything else second",
    "visualTheme": "instrumental-focus"
  },
  "piano-only": {
    "imageUrl": "/images/cards/piano-only.jpg",
    "imageAlt": "Piano only: One instrument, everything said",
    "visualTheme": "instrumental-focus"
  },
  "lo-fi-beats": {
    "imageUrl": "/images/cards/lo-fi-beats.jpg",
    "imageAlt": "Lo-fi beats: Vinyl crackle and homework mode",
    "visualTheme": "instrumental-focus"
  },
  "big-drops": {
    "imageUrl": "/images/cards/big-drops.jpg",
    "imageAlt": "Big drops: Built for the moment everything hits",
    "visualTheme": "dark-club",
    "legacyImageUrl": "/vibes/dark-club-silhouettes.png"
  },
  "acoustic-morning": {
    "imageUrl": "/images/cards/acoustic-morning.jpg",
    "imageAlt": "Acoustic morning: Before the world starts",
    "visualTheme": "acoustic-morning"
  },
  "no-lyrics": {
    "imageUrl": "/images/cards/no-lyrics.jpg",
    "imageAlt": "Person wearing headphones in a minimal workspace at night with soft ambient light",
    "visualTheme": "instrumental-focus",
    "visualPrompt": "person wearing headphones in a minimal workspace at night, soft ambient light, calm focus, cinematic, no text"
  },
  "kpop-energy": {
    "imageUrl": "/images/cards/kpop-energy.jpg",
    "imageAlt": "K-pop energy: Produced within an inch of perfection",
    "visualTheme": "genre-pulse"
  },
  "afrobeats-sunshine": {
    "imageUrl": "/images/cards/afrobeats-sunshine.jpg",
    "imageAlt": "Afrobeats sunshine: Lagos heat, global wave",
    "visualTheme": "afrobeats",
    "legacyImageUrl": "/vibes/afrobeats-sunshine.png"
  },
  "latin-party": {
    "imageUrl": "/images/cards/latin-party.jpg",
    "imageAlt": "Latin party: Hips don't lie, neither does the bassline",
    "visualTheme": "party-pregame"
  },
  "bollywood-drama": {
    "imageUrl": "/images/cards/bollywood-drama.jpg",
    "imageAlt": "Bollywood drama: Big feelings, bigger production",
    "visualTheme": "genre-pulse"
  },
  "hip-hop-bars": {
    "imageUrl": "/images/cards/hip-hop-bars.jpg",
    "imageAlt": "Hip-hop bars: Words that land like punches",
    "visualTheme": "genre-pulse"
  },
  "jazz-mood": {
    "imageUrl": "/images/cards/jazz-mood.jpg",
    "imageAlt": "Jazz mood: Improvised and irreplaceable",
    "visualTheme": "genre-pulse"
  },
  "metal-riffs": {
    "imageUrl": "/images/cards/metal-riffs.jpg",
    "imageAlt": "Metal riffs: Controlled fury",
    "visualTheme": "genre-pulse"
  },
  "indie-folk": {
    "imageUrl": "/images/cards/indie-folk.jpg",
    "imageAlt": "Indie folk: Earned sadness, earned beauty",
    "visualTheme": "acoustic-morning"
  },
  "no-country": {
    "imageUrl": "/images/cards/no-country.jpg",
    "imageAlt": "No country, please: Skip the cowboy sadness",
    "visualTheme": "boundary-filter"
  },
  "no-sad-songs": {
    "imageUrl": "/images/cards/no-sad-songs.jpg",
    "imageAlt": "No sad songs: Good vibes only, enforced",
    "visualTheme": "boundary-filter"
  },
  "no-heavy-metal": {
    "imageUrl": "/images/cards/no-heavy-metal.jpg",
    "imageAlt": "No screaming guitars: The riff is too much today",
    "visualTheme": "boundary-filter"
  },
  "no-edm": {
    "imageUrl": "/images/cards/no-edm.jpg",
    "imageAlt": "No DJ drops: Too many festival memories",
    "visualTheme": "dark-club"
  },
  "gym-villain": {
    "imageUrl": "/images/cards/gym-villain.jpg",
    "imageAlt": "Gym villain mode: The final rep is personal",
    "visualTheme": "gym-power",
    "legacyImageUrl": "/vibes/gym-villain-arc.png"
  },
  "victory-lap": {
    "imageUrl": "/images/cards/victory-lap.jpg",
    "imageAlt": "Victory lap: You won. The playlist should know.",
    "visualTheme": "gym-power"
  },
  "midnight-overthinking": {
    "imageUrl": "/images/cards/midnight-overthinking.jpg",
    "imageAlt": "Midnight overthinking: 3am and it's getting specific",
    "visualTheme": "night-drive",
    "legacyImageUrl": "/vibes/mystery-neon-portrait.png"
  },
  "sunday-morning": {
    "imageUrl": "/images/cards/sunday-morning.jpg",
    "imageAlt": "Sunday morning: No plans, no rush, no problem",
    "visualTheme": "rainy-cafe",
    "legacyImageUrl": "/vibes/rainy-cafe-focus.png"
  },
  "pregame-hype": {
    "imageUrl": "/images/cards/pregame-hype.jpg",
    "imageAlt": "Pre-game hype: Getting in the zone before the moment",
    "visualTheme": "party-pregame"
  },
  "window-seat": {
    "imageUrl": "/images/cards/window-seat.jpg",
    "imageAlt": "Window seat feelings: Watching the world go by at speed",
    "visualTheme": "night-drive"
  },
  "soft-chaos": {
    "imageUrl": "/images/cards/soft-chaos.jpg",
    "imageAlt": "Soft chaos: Gentle on the outside, spiraling inside",
    "visualTheme": "soft-chaos"
  },
  "dark-club": {
    "imageUrl": "/images/cards/dark-club.jpg",
    "imageAlt": "Dark club: Smoke machine, no eye contact, perfect",
    "visualTheme": "dark-club",
    "legacyImageUrl": "/vibes/dark-club-silhouettes.png"
  },
  "korean-night-drive": {
    "imageUrl": "/images/cards/korean-night-drive.jpg",
    "imageAlt": "Korean night drive: Seoul at 2am hits different",
    "visualTheme": "night-drive",
    "legacyImageUrl": "/vibes/tokyo-night-drive.png"
  },
  "thai-pop-glow": {
    "imageUrl": "/images/cards/thai-pop-glow.jpg",
    "imageAlt": "Thai pop glow: Bangkok vibes, global feeling",
    "visualTheme": "genre-pulse",
    "legacyImageUrl": "/vibes/global-street-headphones.png"
  },
  "tokyo-neon-walk": {
    "imageUrl": "/images/cards/tokyo-neon-walk.jpg",
    "imageAlt": "Tokyo neon walk: City energy, island aesthetics",
    "visualTheme": "night-drive",
    "legacyImageUrl": "/vibes/tokyo-night-drive.png"
  },
  "french-cafe": {
    "imageUrl": "/images/cards/french-cafe.jpg",
    "imageAlt": "French café: Existential and stylish",
    "visualTheme": "rainy-cafe",
    "legacyImageUrl": "/vibes/rainy-cafe-focus.png"
  },
  "lagos-everywhere": {
    "imageUrl": "/images/cards/lagos-everywhere.jpg",
    "imageAlt": "Lagos everywhere: Afrobeats crossed every border already",
    "visualTheme": "afrobeats",
    "legacyImageUrl": "/vibes/afrobeats-sunshine.png"
  },
  "punjabi-heat": {
    "imageUrl": "/images/cards/punjabi-heat.jpg",
    "imageAlt": "Punjabi heat: Diaspora energy, global reach",
    "visualTheme": "global-street",
    "legacyImageUrl": "/vibes/global-street-headphones.png"
  },
  "hindi-cinema": {
    "imageUrl": "/images/cards/hindi-cinema.jpg",
    "imageAlt": "Hindi cinema: Romance at feature-film scale",
    "visualTheme": "genre-pulse",
    "legacyImageUrl": "/vibes/global-street-headphones.png"
  },
  "spanish-sun": {
    "imageUrl": "/images/cards/spanish-sun.jpg",
    "imageAlt": "Spanish sun: Latin heat, zero explanations needed",
    "visualTheme": "beach-sunset",
    "legacyImageUrl": "/vibes/soft-beach-sunset.png"
  },
  "walking-fast-no-reason": {
    "imageUrl": "/images/cards/walking-fast-no-reason.jpg",
    "imageAlt": "Walking fast for no reason: Nobody is chasing you. Allegedly.",
    "visualTheme": "main-character"
  },
  "reread-old-texts": {
    "imageUrl": "/images/cards/reread-old-texts.jpg",
    "imageAlt": "You reread old texts: For research, obviously",
    "visualTheme": "heartbreak"
  },
  "preworkout-personality-change": {
    "imageUrl": "/images/cards/preworkout-personality-change.jpg",
    "imageAlt": "Pre-workout personality change: A legal transformation, barely",
    "visualTheme": "gym-power",
    "legacyImageUrl": "/vibes/gym-villain-arc.png"
  },
  "coffee-shop-dramatic": {
    "imageUrl": "/images/cards/coffee-shop-dramatic.jpg",
    "imageAlt": "Coffee shop but dramatic: Laptop open, lore active",
    "visualTheme": "rainy-cafe",
    "legacyImageUrl": "/vibes/rainy-cafe-focus.png"
  },
  "country-respect-heartbreak": {
    "imageUrl": "/images/cards/country-respect-heartbreak.jpg",
    "imageAlt": "You hate country but respect heartbreak: The banjo is on probation",
    "visualTheme": "heartbreak"
  },
  "bass-over-lyrics": {
    "imageUrl": "/images/cards/bass-over-lyrics.jpg",
    "imageAlt": "Bass more than lyrics: Comprehension is optional",
    "visualTheme": "dark-club",
    "legacyImageUrl": "/vibes/dark-club-silhouettes.png"
  },
  "foreign-language-feelings": {
    "imageUrl": "/images/cards/foreign-language-feelings.jpg",
    "imageAlt": "Songs in languages you don't speak: The melody translated enough",
    "visualTheme": "global-street",
    "legacyImageUrl": "/vibes/global-street-headphones.png"
  },
  "cleaning-like-mad": {
    "imageUrl": "/images/cards/cleaning-like-mad.jpg",
    "imageAlt": "Cleaning like you're mad: The countertop did not deserve this",
    "visualTheme": "rage-cleaning",
    "legacyImageUrl": "/vibes/rage-cleaning.png"
  },
  "night-drives-fix-everything": {
    "imageUrl": "/images/cards/night-drives-fix-everything.jpg",
    "imageAlt": "Night drives fix everything: Gas is cheaper than therapy, sometimes",
    "visualTheme": "night-drive",
    "legacyImageUrl": "/vibes/tokyo-night-drive.png"
  },
  "skip-slow-intros": {
    "imageUrl": "/images/cards/skip-slow-intros.jpg",
    "imageAlt": "Skip slow intros: Get to the part that knows why it's here",
    "visualTheme": "instrumental-focus"
  },
  "pretty-toxic-energy": {
    "imageUrl": "/images/cards/pretty-toxic-energy.jpg",
    "imageAlt": "Pretty songs with toxic energy: Gorgeous hook, questionable advice",
    "visualTheme": "dark-club",
    "legacyImageUrl": "/vibes/dark-club-silhouettes.png"
  },
  "illegal-gym-music": {
    "imageUrl": "/images/cards/illegal-gym-music.jpg",
    "imageAlt": "Gym music that sounds illegal: The treadmill filed a report",
    "visualTheme": "gym-power",
    "legacyImageUrl": "/vibes/gym-villain-arc.png"
  },
  "main-character-errands": {
    "imageUrl": "/images/cards/main-character-errands.jpg",
    "imageAlt": "Main character errands: Buying toothpaste with camera energy",
    "visualTheme": "main-character"
  },
  "three-business-days": {
    "imageUrl": "/images/cards/three-business-days.jpg",
    "imageAlt": "You reply in three business days: Emotionally out of office",
    "visualTheme": "night-drive"
  },
  "hot-person-grocery-run": {
    "imageUrl": "/images/cards/hot-person-grocery-run.jpg",
    "imageAlt": "Hot person grocery run: Aisle five, full confidence",
    "visualTheme": "party-pregame",
    "legacyImageUrl": "/vibes/kitchen-pregame.png"
  },
  "fake-calm": {
    "imageUrl": "/images/cards/fake-calm.jpg",
    "imageAlt": "Fake calm: The outfit says peace. The tabs say otherwise.",
    "visualTheme": "instrumental-focus"
  },
  "parking-lot-therapy": {
    "imageUrl": "/images/cards/parking-lot-therapy.jpg",
    "imageAlt": "Parking lot therapy: Engine off, feelings on",
    "visualTheme": "night-drive"
  },
  "shower-concert": {
    "imageUrl": "/images/cards/shower-concert.jpg",
    "imageAlt": "Shower concert: Vocals brave, acoustics forgiving",
    "visualTheme": "party-pregame"
  },
  "running-from-feelings": {
    "imageUrl": "/images/cards/running-from-feelings.jpg",
    "imageAlt": "Running from feelings: Cardio with a subplot",
    "visualTheme": "mystery-neon",
    "legacyImageUrl": "/vibes/mystery-neon-portrait.png"
  },
  "playlist-courtroom": {
    "imageUrl": "/images/cards/playlist-courtroom.jpg",
    "imageAlt": "Playlist courtroom: Every song must defend itself",
    "visualTheme": "mystery-neon"
  },
  "allergic-to-silence": {
    "imageUrl": "/images/cards/allergic-to-silence.jpg",
    "imageAlt": "Allergic to silence: The room is too honest without music",
    "visualTheme": "dark-club",
    "legacyImageUrl": "/vibes/dark-club-silhouettes.png"
  },
  "tiny-speaker-full-volume": {
    "imageUrl": "/images/cards/tiny-speaker-full-volume.jpg",
    "imageAlt": "Full volume on a tiny speaker: Optimism with distortion",
    "visualTheme": "instrumental-focus"
  },
  "expensive-water": {
    "imageUrl": "/images/cards/expensive-water.jpg",
    "imageAlt": "Expensive water energy: Hydrated and slightly superior",
    "visualTheme": "main-character"
  },
  "hoodie-in-july": {
    "imageUrl": "/images/cards/hoodie-in-july.jpg",
    "imageAlt": "Hoodie in July: Committed to the internal weather",
    "visualTheme": "main-character"
  },
  "optimistic-denial": {
    "imageUrl": "/images/cards/optimistic-denial.jpg",
    "imageAlt": "Optimistic denial: Everything is fine if the chorus is bright",
    "visualTheme": "soft-chaos"
  },
  "dramatic-dishwashing": {
    "imageUrl": "/images/cards/dramatic-dishwashing.jpg",
    "imageAlt": "Dramatic dishwashing: The sink is a stage",
    "visualTheme": "rage-cleaning",
    "legacyImageUrl": "/vibes/rage-cleaning.png"
  },
  "romance-is-cardio": {
    "imageUrl": "/images/cards/romance-is-cardio.jpg",
    "imageAlt": "Romance is cardio: Heart rate: emotionally elevated",
    "visualTheme": "gym-power"
  },
  "best-friend-hype": {
    "imageUrl": "/images/cards/best-friend-hype.jpg",
    "imageAlt": "Best friend hype mode: Everyone is leaving hotter",
    "visualTheme": "party-pregame",
    "legacyImageUrl": "/vibes/kitchen-pregame.png"
  },
  "no-small-talk": {
    "imageUrl": "/images/cards/no-small-talk.jpg",
    "imageAlt": "No small talk: Deep cut or silence",
    "visualTheme": "boundary-filter"
  },
  "mystery-era": {
    "imageUrl": "/images/cards/mystery-era.jpg",
    "imageAlt": "Mystery era: Unavailable, but tastefully",
    "visualTheme": "mystery-neon",
    "legacyImageUrl": "/vibes/mystery-neon-portrait.png"
  },
  "healing-but-loud": {
    "imageUrl": "/images/cards/healing-but-loud.jpg",
    "imageAlt": "Healing but loud: Growth with a subwoofer",
    "visualTheme": "soft-chaos"
  },
  "sad-but-booked": {
    "imageUrl": "/images/cards/sad-but-booked.jpg",
    "imageAlt": "Sad but booked: Crying between obligations",
    "visualTheme": "heartbreak"
  },
  "eye-contact-bridge": {
    "imageUrl": "/images/cards/eye-contact-bridge.jpg",
    "imageAlt": "Eye contact during the bridge: A public health concern",
    "visualTheme": "mystery-neon"
  },
  "deadline-soundtrack": {
    "imageUrl": "/images/cards/deadline-soundtrack.jpg",
    "imageAlt": "Deadline soundtrack: Pressure, but make it rhythmic",
    "visualTheme": "instrumental-focus"
  },
  "errands-as-movie": {
    "imageUrl": "/images/cards/errands-as-movie.jpg",
    "imageAlt": "Errands as a movie: A-list walk to the pharmacy",
    "visualTheme": "main-character"
  },
  "bad-idea-good-song": {
    "imageUrl": "/images/cards/bad-idea-good-song.jpg",
    "imageAlt": "Bad idea, good song: The chorus made a case",
    "visualTheme": "mystery-neon"
  },
  "main-character-on-bus": {
    "imageUrl": "/images/cards/main-character-on-bus.jpg",
    "imageAlt": "Main character on public transit: Window seat, full inner monologue",
    "visualTheme": "night-drive"
  },
  "aux-control-issues": {
    "imageUrl": "/images/cards/aux-control-issues.jpg",
    "imageAlt": "Aux control issues: You can stop anytime, but won't",
    "visualTheme": "mystery-neon"
  },
  "pregame-in-kitchen": {
    "imageUrl": "/images/cards/pregame-in-kitchen.jpg",
    "imageAlt": "Pregame in the kitchen: Countertop choreography",
    "visualTheme": "party-pregame",
    "legacyImageUrl": "/vibes/kitchen-pregame.png"
  },
  "private-dance-break": {
    "imageUrl": "/images/cards/private-dance-break.jpg",
    "imageAlt": "Private dance break: No witnesses, maximum commitment",
    "visualTheme": "party-pregame"
  },
  "crying-in-car": {
    "imageUrl": "/images/cards/crying-in-car.jpg",
    "imageAlt": "Crying in the car: Excellent acoustics, questionable visibility",
    "visualTheme": "night-drive"
  },
  "one-more-song-lie": {
    "imageUrl": "/images/cards/one-more-song-lie.jpg",
    "imageAlt": "One more song is a lie: The loop has no exit",
    "visualTheme": "mystery-neon"
  },
  "no-ballads-today": {
    "imageUrl": "/images/cards/no-ballads-today.jpg",
    "imageAlt": "No ballads today: Feelings can file a request tomorrow",
    "visualTheme": "boundary-filter"
  },
  "acoustic-trust-issues": {
    "imageUrl": "/images/cards/acoustic-trust-issues.jpg",
    "imageAlt": "Acoustic trust issues: Put the guitar down gently",
    "visualTheme": "acoustic-morning"
  },
  "clean-room-new-life": {
    "imageUrl": "/images/cards/clean-room-new-life.jpg",
    "imageAlt": "Clean room, new life: Rebrand starts at the laundry pile",
    "visualTheme": "rage-cleaning",
    "legacyImageUrl": "/vibes/rage-cleaning.png"
  },
  "crush-delusion": {
    "imageUrl": "/images/cards/crush-delusion.jpg",
    "imageAlt": "Crush delusion: Three seconds of eye contact, full trilogy",
    "visualTheme": "heartbreak"
  },
  "global-chorus-hunter": {
    "imageUrl": "/images/cards/global-chorus-hunter.jpg",
    "imageAlt": "Global chorus hunter: If the hook hits, the passport is valid",
    "visualTheme": "global-street",
    "legacyImageUrl": "/vibes/global-street-headphones.png"
  },
  "gym-after-breakup": {
    "imageUrl": "/images/cards/gym-after-breakup.jpg",
    "imageAlt": "Gym after a breakup: Healing, but make it a PR attempt",
    "visualTheme": "gym-power",
    "legacyImageUrl": "/vibes/gym-villain-arc.png"
  },
  "late-reply-fast-walk": {
    "imageUrl": "/images/cards/late-reply-fast-walk.jpg",
    "imageAlt": "Late reply, fast walk: Unavailable but moving",
    "visualTheme": "main-character"
  },
  "headphones-boundary": {
    "imageUrl": "/images/cards/headphones-boundary.jpg",
    "imageAlt": "Headphones as a boundary: Do not disturb, but with bass",
    "visualTheme": "instrumental-focus"
  },
  "villain-with-snacks": {
    "imageUrl": "/images/cards/villain-with-snacks.jpg",
    "imageAlt": "Villain with snacks: Menace, but hydrated",
    "visualTheme": "gym-power"
  },
  "soft-launch-season": {
    "imageUrl": "/images/cards/soft-launch-season.jpg",
    "imageAlt": "Soft launch season: No names, just vibes",
    "visualTheme": "beach-sunset",
    "legacyImageUrl": "/vibes/soft-beach-sunset.png"
  },
  "subtitles-off-feelings-on": {
    "imageUrl": "/images/cards/subtitles-off-feelings-on.jpg",
    "imageAlt": "Subtitles off, feelings on: You understood the ache",
    "visualTheme": "global-street",
    "legacyImageUrl": "/vibes/global-street-headphones.png"
  },
  "emotionally-available-bass": {
    "imageUrl": "/images/cards/emotionally-available-bass.jpg",
    "imageAlt": "Emotionally available bass: A beat that checks in",
    "visualTheme": "dark-club",
    "legacyImageUrl": "/vibes/dark-club-silhouettes.png"
  },
  "standing-in-doorway": {
    "imageUrl": "/images/cards/standing-in-doorway.jpg",
    "imageAlt": "Standing in the doorway deciding: Leaving soon, spiritually already gone",
    "visualTheme": "mystery-neon"
  },
  "volume-up-feelings-down": {
    "imageUrl": "/images/cards/volume-up-feelings-down.jpg",
    "imageAlt": "Volume up, feelings down: A temporary but effective policy",
    "visualTheme": "heartbreak"
  },
  "outfit-before-plans": {
    "imageUrl": "/images/cards/outfit-before-plans.jpg",
    "imageAlt": "Outfit before plans: The vibe was scheduled first",
    "visualTheme": "main-character"
  },
  "calendar-full-heart-empty": {
    "imageUrl": "/images/cards/calendar-full-heart-empty.jpg",
    "imageAlt": "Calendar full, heart empty-ish: Busy is a playlist genre",
    "visualTheme": "night-drive"
  },
  "delete-the-draft": {
    "imageUrl": "/images/cards/delete-the-draft.jpg",
    "imageAlt": "Delete the draft: Growth looked at the message and said no",
    "visualTheme": "heartbreak"
  },
  "low-battery-high-drama": {
    "imageUrl": "/images/cards/low-battery-high-drama.jpg",
    "imageAlt": "Low battery, high drama: Phone at 3%, emotions at 97%",
    "visualTheme": "soft-chaos"
  },
  "quietly-competitive": {
    "imageUrl": "/images/cards/quietly-competitive.jpg",
    "imageAlt": "Quietly competitive: You said no worries, then locked in",
    "visualTheme": "instrumental-focus"
  },
  "romanticize-the-commute": {
    "imageUrl": "/images/cards/romanticize-the-commute.jpg",
    "imageAlt": "Romanticize the commute: Public transit, private cinema",
    "visualTheme": "night-drive"
  },
  "group-chat-lawyer": {
    "imageUrl": "/images/cards/group-chat-lawyer.jpg",
    "imageAlt": "Group chat lawyer: Screenshots entered into evidence",
    "visualTheme": "mystery-neon"
  },
  "soft-life-with-edge": {
    "imageUrl": "/images/cards/soft-life-with-edge.jpg",
    "imageAlt": "Soft life with edge: Candles lit, boundaries sharper",
    "visualTheme": "soft-chaos"
  },
  "chorus-as-personality": {
    "imageUrl": "/images/cards/chorus-as-personality.jpg",
    "imageAlt": "Chorus as a personality: If it hits, you become it",
    "visualTheme": "instrumental-focus"
  },
  "do-not-shuffle": {
    "imageUrl": "/images/cards/do-not-shuffle.jpg",
    "imageAlt": "Do not shuffle: The order is part of the thesis",
    "visualTheme": "instrumental-focus"
  },
  "sunlight-after-spiral": {
    "imageUrl": "/images/cards/sunlight-after-spiral.jpg",
    "imageAlt": "Sunlight after a spiral: New morning, same lore",
    "visualTheme": "rainy-cafe",
    "legacyImageUrl": "/vibes/rainy-cafe-focus.png"
  },
  "drive": {
    "imageUrl": "/images/cards/drive.jpg",
    "imageAlt": "undefined: undefined",
    "visualTheme": "night-drive"
  },
  "gym": {
    "imageUrl": "/images/cards/gym.jpg",
    "imageAlt": "undefined: undefined",
    "visualTheme": "gym-power"
  },
  "focus": {
    "imageUrl": "/images/cards/focus.jpg",
    "imageAlt": "undefined: undefined",
    "visualTheme": "instrumental-focus"
  },
  "party": {
    "imageUrl": "/images/cards/party.jpg",
    "imageAlt": "undefined: undefined",
    "visualTheme": "dark-club",
    "legacyImageUrl": "/vibes/dark-club-silhouettes.png"
  },
  "sad": {
    "imageUrl": "/images/cards/sad.jpg",
    "imageAlt": "undefined: undefined",
    "visualTheme": "heartbreak"
  },
  "chill": {
    "imageUrl": "/images/cards/chill.jpg",
    "imageAlt": "undefined: undefined",
    "visualTheme": "rainy-cafe"
  },
  "random": {
    "imageUrl": "/images/cards/random.jpg",
    "imageAlt": "undefined: undefined",
    "visualTheme": "life-scene"
  }
};
