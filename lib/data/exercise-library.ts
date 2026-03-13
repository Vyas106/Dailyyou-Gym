export interface ExerciseTemplate {
  name: string;
  description: string;
  category: 'Strength' | 'Cardio' | 'Flexibility' | 'Balance' | 'General';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  targetMuscles: string[];
  instructions: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
}

export const exerciseLibrary: ExerciseTemplate[] = [
  // --- CHEST ---
  {
    name: "Barbell Bench Press",
    description: "A classic compound exercise for building overall chest mass and strength.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell", "Bench"],
    targetMuscles: ["Chest", "Triceps", "Shoulders"],
    instructions: "Lie on your back on a flat bench. Grip the barbell with hands slightly wider than shoulder-width. Lower the bar to your mid-chest, then push it back up until arms are fully extended.",
    sets: 4,
    reps: 10,
    restTime: 60
  },
  {
    name: "Dumbbell Flyes",
    description: "An isolation exercise that targets the chest without involving the triceps as much as presses.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Dumbbells", "Bench"],
    targetMuscles: ["Chest"],
    instructions: "Lie on a flat bench holding dumbbells above your chest. Lower weights in a wide arc until you feel a stretch in your chest, then squeeze them back to the start position.",
    sets: 3,
    reps: 12,
    restTime: 45
  },
  {
    name: "Incline Barbell Press",
    description: "Targets the upper portion of the pectoral muscles.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell", "Incline Bench"],
    targetMuscles: ["Upper Chest", "Shoulders", "Triceps"],
    instructions: "Set a bench to a 30-45 degree incline. Lower the barbell to your upper chest and press upward.",
    sets: 3,
    reps: 10,
    restTime: 60
  },
  {
    name: "Decline Dumbbell Press",
    description: "Targets the lower portion of the chest.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Dumbbells", "Decline Bench"],
    targetMuscles: ["Lower Chest", "Triceps"],
    instructions: "Lie on a decline bench. Press the dumbbells from your lower chest up toward the ceiling.",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    name: "Push-Ups",
    description: "A fundamental bodyweight exercise for chest and core.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["None"],
    targetMuscles: ["Chest", "Triceps", "Core"],
    instructions: "Start in a plank position. Lower your body until your chest nearly touches the floor, then push back up.",
    sets: 3,
    reps: 15,
    restTime: 30
  },
  {
    name: "Cable Crossovers",
    description: "Great for isolation and keeping constant tension on the chest muscles.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Cable Machine"],
    targetMuscles: ["Chest"],
    instructions: "Stand between two cable pulleys. Pull the handles down and together in front of your body.",
    sets: 3,
    reps: 15,
    restTime: 45
  },
  {
    name: "Dumbbell Pullover",
    description: "Expands the ribcage and works both the chest and lats.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Dumbbell", "Bench"],
    targetMuscles: ["Chest", "Lats"],
    instructions: "Lie across a bench with only your shoulders supported. Lower a dumbbell behind your head and pull it back over your chest.",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    name: "Machine Chest Press",
    description: "A safer alternative to free weights for beginners or for high-volume training.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Chest Press Machine"],
    targetMuscles: ["Chest", "Triceps"],
    instructions: "Sit in the machine and push the handles forward until arms are extended.",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    name: "Pec Deck Machine",
    description: "Isolates the chest muscles through a flying motion.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Pec Deck Machine"],
    targetMuscles: ["Chest"],
    instructions: "Sit with your back against the pad. Squeeze the handles together in front of you.",
    sets: 3,
    reps: 15,
    restTime: 45
  },
  {
    name: "Weighted Dips",
    description: "Powerful compound exercise for lower chest and triceps.",
    category: "Strength",
    difficulty: "Advanced",
    equipment: ["Dip Bar", "Dip Belt"],
    targetMuscles: ["Lower Chest", "Triceps", "Shoulders"],
    instructions: "Suspend yourself on dip bars. Lean forward slightly and lower your body, then push back up.",
    sets: 3,
    reps: 8,
    restTime: 90
  },
  {
    name: "Landmine Press",
    description: "A shoulder-friendly way to target the upper chest and shoulders.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell", "Landmine Attachment"],
    targetMuscles: ["Upper Chest", "Front Delts"],
    instructions: "Grip the end of a barbell anchored in a landmine. Press it upward and forward.",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    name: "Floor Press",
    description: "Reduces range of motion to focus on the top part of the press and protects the shoulders.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell", "Floor"],
    targetMuscles: ["Chest", "Triceps"],
    instructions: "Lie on the floor and perform a bench press. Stop when your elbows touch the ground.",
    sets: 3,
    reps: 10,
    restTime: 60
  },

  // --- BACK ---
  {
    name: "Deadlift",
    description: "The king of all exercises. Works the entire posterior chain.",
    category: "Strength",
    difficulty: "Advanced",
    equipment: ["Barbell"],
    targetMuscles: ["Back", "Glutes", "Hamstrings", "Core"],
    instructions: "Stand with feet shoulder-width apart. Hinge at hips to grab the bar. Lift the bar by extending hips and knees to a full upright position.",
    sets: 3,
    reps: 5,
    restTime: 120
  },
  {
    name: "Pull-Ups",
    description: "Classic vertical pull for back width.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Pull-up Bar"],
    targetMuscles: ["Lats", "Biceps", "Upper Back"],
    instructions: "Hang from a bar with an overhand grip. Pull your body up until your chin is over the bar.",
    sets: 3,
    reps: 10,
    restTime: 90
  },
  {
    name: "Bent-Over Barbell Rows",
    description: "Great for building back thickness.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell"],
    targetMuscles: ["Lats", "Rhomboids", "Traps"],
    instructions: "Bend at the waist with a straight back. Pull the barbell toward your lower ribs.",
    sets: 4,
    reps: 10,
    restTime: 60
  },
  {
    name: "Lat Pulldown",
    description: "A machine alternative to pull-ups, allowing for controlled weight.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Lat Pulldown Machine"],
    targetMuscles: ["Lats", "Biceps"],
    instructions: "Sit at the machine and pull the bar down to your upper chest while leaning back slightly.",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    name: "One-Arm Dumbbell Row",
    description: "Allows for a greater range of motion and helps fix imbalances.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbell", "Bench"],
    targetMuscles: ["Lats", "Upper Back"],
    instructions: "Place one knee and hand on a bench. Pull a dumbbell toward your hip with the other hand.",
    sets: 3,
    reps: 12,
    restTime: 45
  },
  {
    name: "Seated Cable Row",
    description: "Targets the mid-back and rhomboids.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Cable Machine"],
    targetMuscles: ["Back", "Biceps"],
    instructions: "Sit at the row machine. Pull the handles toward your stomach while squeezing your shoulder blades.",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    name: "T-Bar Row",
    description: "Focuses on the inner back and thickness.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["T-Bar Machine", "Barbell"],
    targetMuscles: ["Mid Back", "Traps"],
    instructions: "Stand over the bar and pull the weight toward your chest while maintaining a flat back.",
    sets: 3,
    reps: 10,
    restTime: 75
  },
  {
    name: "Face Pulls",
    description: "Excellent for rear delts and upper back health.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Cable Machine", "Rope Attachment"],
    targetMuscles: ["Rear Delts", "Upper Back", "Rotator Cuff"],
    instructions: "Pull the rope toward your forehead, pulling the ends apart as you reach your face.",
    sets: 3,
    reps: 15,
    restTime: 45
  },
  {
    name: "Hyperextensions",
    description: "Strengthens the lower back (erector spinae).",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Hyperextension Bench"],
    targetMuscles: ["Lower Back", "Glutes", "Hamstrings"],
    instructions: "Hinge at the hips on the bench, lowering your torso and then raising it back to neutral.",
    sets: 3,
    reps: 15,
    restTime: 45
  },
  {
    name: "Straight Arm Lat Pulldown",
    description: "Isolates the lats by removing bicep involvement.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Cable Machine"],
    targetMuscles: ["Lats"],
    instructions: "With arms straight, pull the cable bar from above your head down to your thighs.",
    sets: 3,
    reps: 15,
    restTime: 45
  },

  // --- SHOULDERS ---
  {
    name: "Overhead Barbell Press",
    description: "The primary exercise for shoulder strength and size.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell"],
    targetMuscles: ["Shoulders", "Triceps"],
    instructions: "Stand with the barbell at shoulder height. Press it vertically until arms are locked out.",
    sets: 4,
    reps: 8,
    restTime: 90
  },
  {
    name: "Dumbbell Lateral Raises",
    description: "The best exercise for targeting the side deltoids to build shoulder width.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbells"],
    targetMuscles: ["Side Delts"],
    instructions: "Stand with dumbbells at your sides. Lift them out to the side until your arms are parallel to the floor.",
    sets: 4,
    reps: 15,
    restTime: 45
  },
  {
    name: "Dumbbell Front Raises",
    description: "Targets the anterior (front) deltoids.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbells"],
    targetMuscles: ["Front Delts"],
    instructions: "Lift dumbbells in front of you until they reach eye level.",
    sets: 3,
    reps: 12,
    restTime: 45
  },
  {
    name: "Rear Delt Flyes",
    description: "Targets the posterior deltoids for balanced shoulder development.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbells", "Bench"],
    targetMuscles: ["Rear Delts"],
    instructions: "Bend over or lie face down on a bench. Lift dumbbells out to the sides while squeezing the shoulder blades.",
    sets: 3,
    reps: 15,
    restTime: 45
  },
  {
    name: "Arnold Press",
    description: "A variation of the shoulder press that hits multiple parts of the delt.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Dumbbells"],
    targetMuscles: ["Shoulders", "Triceps"],
    instructions: "Start with palms facing you. Rotate palms outward as you press the dumbbells overhead.",
    sets: 3,
    reps: 10,
    restTime: 60
  },
  {
    name: "Upright Rows",
    description: "Compound movement for traps and side delts.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell", "EZ Bar", "Cable"],
    targetMuscles: ["Traps", "Shoulders"],
    instructions: "Pull the weight vertically toward your chin, keeping it close to your body.",
    sets: 3,
    reps: 10,
    restTime: 60
  },
  {
    name: "Shrugs",
    description: "Directly targets the upper traps.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbells", "Barbell"],
    targetMuscles: ["Traps"],
    instructions: "Hold weights at your sides and lift your shoulders toward your ears.",
    sets: 3,
    reps: 15,
    restTime: 45
  },

  // --- LEGS ---
  {
    name: "Barbell Back Squat",
    description: "The gold standard for leg development.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell", "Squat Rack"],
    targetMuscles: ["Quads", "Glutes", "Hamstrings", "Lower Back"],
    instructions: "Rest the bar on your upper back. Squat down until thighs are parallel to the floor, then stand back up.",
    sets: 4,
    reps: 8,
    restTime: 120
  },
  {
    name: "Leg Press",
    description: "Allows for high-volume leg training with less spinal loading.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Leg Press Machine"],
    targetMuscles: ["Quads", "Glutes"],
    instructions: "Push the platform away with your legs and control the weight on the way back down.",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    name: "Romanian Deadlift",
    description: "Excellent for targeting the hamstrings and glutes.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell", "Dumbbells"],
    targetMuscles: ["Hamstrings", "Glutes", "Lower Back"],
    instructions: "Hinge at the hips while keeping legs relatively straight. Lower the weight until you feel a deep stretch in hamstrings.",
    sets: 3,
    reps: 10,
    restTime: 90
  },
  {
    name: "Leg Extensions",
    description: "Isolation exercise for the quadriceps.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Leg Extension Machine"],
    targetMuscles: ["Quads"],
    instructions: "Sit in the machine and extend your legs until they are straight.",
    sets: 3,
    reps: 15,
    restTime: 45
  },
  {
    name: "Lying Leg Curls",
    description: "Isolates the hamstring muscles.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Leg Curl Machine"],
    targetMuscles: ["Hamstrings"],
    instructions: "Lie face down and curl the weight toward your glutes.",
    sets: 3,
    reps: 12,
    restTime: 45
  },
  {
    name: "Bulgarian Split Squats",
    description: "An intense single-leg exercise for glutes and quads.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Dumbbells", "Bench"],
    targetMuscles: ["Quads", "Glutes", "Hamstrings"],
    instructions: "Place one foot back on a bench. Squat down with the front leg.",
    sets: 3,
    reps: 10,
    restTime: 60
  },
  {
    name: "Calf Raises (Standing)",
    description: "Primary exercise for building the gastrocnemius muscle of the calf.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Calf Raise Machine", "Dumbbell"],
    targetMuscles: ["Calves"],
    instructions: "Rise up on the balls of your feet, hold for a second, and lower back down.",
    sets: 4,
    reps: 15,
    restTime: 30
  },
  {
    name: "Lunges",
    description: "Versatile leg exercise for stability and strength.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["None", "Dumbbells"],
    targetMuscles: ["Quads", "Glutes", "Hamstrings"],
    instructions: "Step forward and lower your hips until both knees are bent at about a 90-degree angle.",
    sets: 3,
    reps: 12,
    restTime: 45
  },
  {
    name: "Hip Thrusts",
    description: "Arguably the best exercise for glute isolation.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["Barbell", "Bench"],
    targetMuscles: ["Glutes"],
    instructions: "Rest your upper back on a bench with a barbell across your hips. Drive the weight up using your glutes.",
    sets: 4,
    reps: 10,
    restTime: 90
  },

  // --- ARMS (BICEPS / TRICEPS) ---
  {
    name: "Barbell Bicep Curls",
    description: "Fundamental mass builder for the biceps.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Barbell", "EZ Bar"],
    targetMuscles: ["Biceps"],
    instructions: "Hold the bar with underhand grip. Curl the bar toward your shoulders while keeping elbows at your side.",
    sets: 3,
    reps: 10,
    restTime: 45
  },
  {
    name: "Dumbbell Hammer Curls",
    description: "Targets the brachialis and brachioradialis (forearm).",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbells"],
    targetMuscles: ["Biceps", "Forearms"],
    instructions: "Hold dumbbells with palms facing each other. Curl them toward your shoulders.",
    sets: 3,
    reps: 12,
    restTime: 45
  },
  {
    name: "Incline Dumbbell Curls",
    description: "Puts the biceps in a stretched position for better growth.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbells", "Incline Bench"],
    targetMuscles: ["Biceps"],
    instructions: "Lie on an incline bench and curl the dumbbells while keeping elbows behind your torso.",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    name: "Tricep Pushdowns",
    description: "Classic cable exercise for all three tricep heads.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Cable Machine"],
    targetMuscles: ["Triceps"],
    instructions: "Push the cable bar or rope down until arms are straight, then slowly return to start.",
    sets: 3,
    reps: 15,
    restTime: 45
  },
  {
    name: "Skull Crushers",
    description: "Also known as Lying Tricep Extensions; great for tricep mass.",
    category: "Strength",
    difficulty: "Intermediate",
    equipment: ["EZ Bar", "Dumbbells", "Bench"],
    targetMuscles: ["Triceps"],
    instructions: "Lie on a bench. Lower the weight toward your forehead and then extend arms back up.",
    sets: 3,
    reps: 10,
    restTime: 60
  },
  {
    name: "Overhead Tricep Extension",
    description: "Targets the long head of the triceps.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["Dumbbell", "Cable"],
    targetMuscles: ["Triceps"],
    instructions: "Hold weight above your head with elbows bent, then straighten arms completely.",
    sets: 3,
    reps: 12,
    restTime: 45
  },

  // --- CORE ---
  {
    name: "Plank",
    description: "Isometric core exercise for stability and endurance.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["None"],
    targetMuscles: ["Abs", "Obliques", "Lower Back"],
    instructions: "Hold a push-up position with your weight on your forearms instead of your hands.",
    sets: 3,
    reps: 1,
    duration: 60,
    restTime: 30
  },
  {
    name: "Hanging Leg Raises",
    description: "Advanced exercise for lower abs and hip flexors.",
    category: "Strength",
    difficulty: "Advanced",
    equipment: ["Pull-up Bar"],
    targetMuscles: ["Lower Abs", "Hip Flexors"],
    instructions: "Hang from a bar and lift your legs until they are parallel to the ground.",
    sets: 3,
    reps: 12,
    restTime: 45
  },
  {
    name: "Russian Twists",
    description: "Excellent for the obliques and rotational strength.",
    category: "Strength",
    difficulty: "Beginner",
    equipment: ["None", "Weight Plate", "Medicine Ball"],
    targetMuscles: ["Obliques", "Abs"],
    instructions: "Sit on the floor with knees bent. Twist your torso from side to side.",
    sets: 3,
    reps: 20,
    restTime: 30
  },
  {
    name: "Ab Wheel Rollouts",
    description: "Intense core exercise for anti-extension strength.",
    category: "Strength",
    difficulty: "Advanced",
    equipment: ["Ab Wheel"],
    targetMuscles: ["Abs", "Lower Back", "Lats"],
    instructions: "Kneal on the floor. Roll the wheel forward as far as possible without arching your back, then pull back.",
    sets: 3,
    reps: 10,
    restTime: 60
  },

  // --- CARDIO ---
  {
    name: "Treadmill Run",
    description: "Standard cardiovascular training.",
    category: "Cardio",
    difficulty: "Beginner",
    equipment: ["Treadmill"],
    targetMuscles: ["Legs", "Heart"],
    instructions: "Run or walk at a consistent pace on the treadmill.",
    duration: 20
  },
  {
    name: "Burpees",
    description: "High-intensity full-body cardio and strength movement.",
    category: "Cardio",
    difficulty: "Intermediate",
    equipment: ["None"],
    targetMuscles: ["Full Body", "Heart"],
    instructions: "From standing, drop to a push-up position, do a push-up, jump feet in, and jump up with hands overhead.",
    sets: 3,
    reps: 15,
    restTime: 60
  },
  {
    name: "Battle Ropes",
    description: "Excellent for cardio and upper body endurance.",
    category: "Cardio",
    difficulty: "Intermediate",
    equipment: ["Battle Ropes"],
    targetMuscles: ["Arms", "Shoulders", "Core"],
    instructions: "Slam or wave the ropes rapidly for a set duration.",
    sets: 4,
    reps: 30, // seconds
    restTime: 30
  },
  {
    name: "Jump Rope",
    description: "Highly efficient cardio and coordination exercise.",
    category: "Cardio",
    difficulty: "Beginner",
    equipment: ["Jump Rope"],
    targetMuscles: ["Calves", "Heart"],
    instructions: "Jump over the rope repeatedly as it passes under your feet.",
    duration: 10
  }
];

// Add 60 more exercises to reach 100+
export const expandedExerciseLibrary: ExerciseTemplate[] = [
  ...exerciseLibrary,
  // Chest additions
  { name: "Single Arm Cable Chest Press", description: "Unilateral chest training.", category: "Strength", difficulty: "Intermediate", equipment: ["Cable Machine"], targetMuscles: ["Chest", "Core"], instructions: "Stand sideways to a cable machine and press with one arm." },
  { name: "Medicine Ball Chest Pass", description: "Explosive chest power.", category: "Strength", difficulty: "Beginner", equipment: ["Medicine Ball"], targetMuscles: ["Chest", "Triceps"], instructions: "Throw the medicine ball forward from your chest against a wall or to a partner." },
  { name: "Svend Press", description: "Isometric chest exercise using plates.", category: "Strength", difficulty: "Beginner", equipment: ["Weight Plate"], targetMuscles: ["Chest"], instructions: "Press two small plates together in front of your chest and extend arms forward." },
  { name: "Wide Grip Pushups", description: "Focuses more on the outer chest.", category: "Strength", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Chest"], instructions: "Perform a pushup with hands wider than usual." },
  { name: "Diamond Pushups", description: "Focuses more on triceps and inner chest.", category: "Strength", difficulty: "Intermediate", equipment: ["None"], targetMuscles: ["Triceps", "Inner Chest"], instructions: "Perform a pushup with hands close together forming a diamond shape." },
  
  // Back additions
  { name: "Close Grip Lat Pulldown", description: "Targets the lower lats and mid-back.", category: "Strength", difficulty: "Beginner", equipment: ["Lat Pulldown Machine"], targetMuscles: ["Lats", "Mid Back"], instructions: "Use a V-bar handle for pull-downs." },
  { name: "ラックプル (Rack Pulls)", description: "Partial deadlift focusing on the upper back.", category: "Strength", difficulty: "Intermediate", equipment: ["Barbell", "Power Rack"], targetMuscles: ["Upper Back", "Traps", "Lower Back"], instructions: "Deadlift the bar from about knee height in a power rack." },
  { name: "Inverted Row", description: "Bodyweight pull for those working toward pull-ups.", category: "Strength", difficulty: "Beginner", equipment: ["Smith Machine", "Power Rack"], targetMuscles: ["Back", "Biceps"], instructions: "Lie under a bar and pull your chest up to it." },
  { name: "Renegade Row", description: "Core and back stability exercise.", category: "Strength", difficulty: "Advanced", equipment: ["Dumbbells"], targetMuscles: ["Back", "Core", "Shoulders"], instructions: "In a plank position holding dumbbells, perform rows alternating arms." },
  { name: "Kneeling Lat Pullover", description: "Cable variation for lat isolation.", category: "Strength", difficulty: "Intermediate", equipment: ["Cable Machine"], targetMuscles: ["Lats"], instructions: "Kneel and pull the cable bar down with straight arms." },
  
  // Shoulder additions
  { name: "Face Pulls with External Rotation", description: "Enhanced version for rotator cuff health.", category: "Strength", difficulty: "Intermediate", equipment: ["Cable Machine"], targetMuscles: ["Rear Delts", "Rotator Cuff"], instructions: "Pull the rope to your face and rotate hands up." },
  { name: "Barbell Front Raise", description: "Strict front delt isolation.", category: "Strength", difficulty: "Intermediate", equipment: ["Barbell"], targetMuscles: ["Front Delts"], instructions: "Lift a barbell in front of you with straight arms." },
  { name: "Z-Press", description: "Seated overhead press for core stability.", category: "Strength", difficulty: "Advanced", equipment: ["Barbell", "Dumbbells"], targetMuscles: ["Shoulders", "Core"], instructions: "Sit on the floor with legs straight and press weights overhead." },
  { name: "Cable Lateral Raise", description: "Constant tension on the side delts.", category: "Strength", difficulty: "Beginner", equipment: ["Cable Machine"], targetMuscles: ["Side Delts"], instructions: "Perform lateral raises using a low cable pulley." },
  { name: "Bus Drivers", description: "Endurance for front delts.", category: "Strength", difficulty: "Beginner", equipment: ["Weight Plate"], targetMuscles: ["Front Delts"], instructions: "Hold a plate in front of you and rotate it like a steering wheel." },

  // Leg additions
  { name: "Front Squat", description: "Quad-dominant squat variation.", category: "Strength", difficulty: "Intermediate", equipment: ["Barbell"], targetMuscles: ["Quads", "Core"], instructions: "Hold the barbell on your front deltoids and perform a squat." },
  { name: "Goblet Squat", description: "Great for learning proper squat form.", category: "Strength", difficulty: "Beginner", equipment: ["Dumbbell", "Kettlebell"], targetMuscles: ["Quads", "Glutes"], instructions: "Hold a weight at chest level and squat." },
  { name: "Hack Squat Machine", description: "Targets the quads with stability.", category: "Strength", difficulty: "Beginner", equipment: ["Hack Squat Machine"], targetMuscles: ["Quads"], instructions: "Use the machine to perform squats." },
  { name: "Seated Hamstring Curls", description: "Comfortable hamstring isolation.", category: "Strength", difficulty: "Beginner", equipment: ["Leg Curl Machine"], targetMuscles: ["Hamstrings"], instructions: "Perform leg curls from a seated position." },
  { name: "Glute Bridges", description: "Glute activation exercise.", category: "Strength", difficulty: "Beginner", equipment: ["None", "Weights"], targetMuscles: ["Glutes"], instructions: "Lie on your back and drive your hips up." },
  { name: "Step-Ups", description: "Unilateral leg movement.", category: "Strength", difficulty: "Beginner", equipment: ["Bench", "Dumbbells"], targetMuscles: ["Quads", "Glutes"], instructions: "Step up onto a bench and drive through the heel." },
  { name: "Sumo Deadlift", description: "Deadlift with a wide stance.", category: "Strength", difficulty: "Intermediate", equipment: ["Barbell"], targetMuscles: ["Glutes", "Hamstrings", "Back"], instructions: "Take a wide stance and pull the bar with hands inside knees." },
  { name: "Box Squats", description: "Builds explosive power out of the hole.", category: "Strength", difficulty: "Intermediate", equipment: ["Barbell", "Box/Bench"], targetMuscles: ["Glutes", "Hamstrings", "Quads"], instructions: "Squat down to a box, pause, and stand back up." },
  { name: "Zercher Squat", description: "Squat holding the bar in the crooks of your elbows.", category: "Strength", difficulty: "Advanced", equipment: ["Barbell"], targetMuscles: ["Quads", "Core", "Back"], instructions: "Hold the bar in your elbows and squat." },
  { name: "Sissy Squat", description: "Bodyweight quad isolation.", category: "Strength", difficulty: "Intermediate", equipment: ["None"], targetMuscles: ["Quads"], instructions: "Lean back on your toes while maintaining a straight line from knees to head." },

  // Arm additions
  { name: "Concentration Curls", description: "Peak-builder for the biceps.", category: "Strength", difficulty: "Beginner", equipment: ["Dumbbell"], targetMuscles: ["Biceps"], instructions: "Sit on a bench and curl a dumbbell with your arm against your thigh." },
  { name: "Preacher Curls", description: "Prevents cheating and isolates the biceps.", category: "Strength", difficulty: "Beginner", equipment: ["Preacher Bench", "EZ Bar"], targetMuscles: ["Biceps"], instructions: "Curl the bar while your arms rest on a preacher pad." },
  { name: "Spider Curls", description: "Focuses on the short head of the biceps.", category: "Strength", difficulty: "Intermediate", equipment: ["Incline Bench", "EZ Bar"], targetMuscles: ["Biceps"], instructions: "Lie face down on an incline bench and curl the bar." },
  { name: "Cable Curls", description: "Constant tension bicep exercise.", category: "Strength", difficulty: "Beginner", equipment: ["Cable Machine"], targetMuscles: ["Biceps"], instructions: "Curls using a cable pulley." },
  { name: "Reverse Barbell Curls", description: "Targets the forearms and brachialis.", category: "Strength", difficulty: "Beginner", equipment: ["Barbell"], targetMuscles: ["Forearms", "Biceps"], instructions: "Perform curls with an overhand grip." },
  { name: "Dips (Chest Focus)", description: "Leaning forward to hit more chest.", category: "Strength", difficulty: "Intermediate", equipment: ["Dip Bar"], targetMuscles: ["Chest", "Triceps"], instructions: "Dip while leaning forward." },
  { name: "Close Grip Bench Press", description: "Bench press variation for triceps.", category: "Strength", difficulty: "Intermediate", equipment: ["Barbell", "Bench"], targetMuscles: ["Triceps", "Chest"], instructions: "Bench press with hands closer than shoulder-width." },
  { name: "Kickbacks", description: "Isolates the triceps.", category: "Strength", difficulty: "Beginner", equipment: ["Dumbbells"], targetMuscles: ["Triceps"], instructions: "Bent over, extend your arm backward." },
  { name: "Tate Press", description: "Targeting triceps with dumbbells.", category: "Strength", difficulty: "Intermediate", equipment: ["Dumbbells", "Bench"], targetMuscles: ["Triceps"], instructions: "Lying on a bench, lower dumbbells towards the center of your chest then extend." },
  { name: "Zottman Curls", description: "Biceps on the way up, forearms on the way down.", category: "Strength", difficulty: "Intermediate", equipment: ["Dumbbells"], targetMuscles: ["Biceps", "Forearms"], instructions: "Curl up with palms up, rotate, and lower with palms down." },

  // Core additions
  { name: "Bicycle Crunches", description: "Fast-paced core movement.", category: "Strength", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Abs", "Obliques"], instructions: "Mimic a bicycle pedaling motion with your legs while touching opposite elbows to knees." },
  { name: "Leg Flutters", description: "Targets lower abs.", category: "Strength", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Lower Abs"], instructions: "Lie on your back and flutter your legs up and down." },
  { name: "V-Ups", description: "Advanced crunch variation.", category: "Strength", difficulty: "Advanced", equipment: ["None"], targetMuscles: ["Abs"], instructions: "Lift your torso and legs simultaneously to form a V shape." },
  { name: "Woodchoppers", description: "Rotational cable movement for obliques.", category: "Strength", difficulty: "Intermediate", equipment: ["Cable Machine"], targetMuscles: ["Obliques"], instructions: "Pull the cable from high to low across your body." },
  { name: "Dead Bug", description: "Safe and effective core stability.", category: "Strength", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Core"], instructions: "Lie on your back and lower opposite arm and leg slowly." },
  { name: "Mountain Climbers", description: "Cardio-core hybrid.", category: "Cardio", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Core", "Heart"], instructions: "In a plank, rapidly bring knees toward chest." },
  { name: "Side Plank", description: "Targets the obliques.", category: "Strength", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Obliques"], instructions: "Hold your body up on one forearm from the side." },
  { name: "Bird Dog", description: "Core and back stability.", category: "Strength", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Core", "Glutes"], instructions: "On all fours, extend opposite arm and leg." },
  { name: "Dragon Flag", description: "Extremely difficult core exercise.", category: "Strength", difficulty: "Advanced", equipment: ["Bench"], targetMuscles: ["Abs"], instructions: "Lie on a bench and lift your entire body vertically using only your shoulders for support." },
  { name: "Cable Crunches", description: "Weighted ab training.", category: "Strength", difficulty: "Beginner", equipment: ["Cable Machine"], targetMuscles: ["Abs"], instructions: "Kneel and crunch down pulling a cable rope." },

  // Cardio additions
  { name: "Rowing Machine", description: "Full body cardio.", category: "Cardio", difficulty: "Beginner", equipment: ["Rowing Machine"], targetMuscles: ["Back", "Legs", "Heart"], instructions: "Standard rowing motion." },
  { name: "Kettlebell Swings", description: "Explosive posterior chain cardio.", category: "Strength", difficulty: "Intermediate", equipment: ["Kettlebell"], targetMuscles: ["Glutes", "Heart"], instructions: "Swing the kettlebell between your legs and up to chest level." },
  { name: "Sled Push", description: "Intense functional cardio.", category: "Cardio", difficulty: "Intermediate", equipment: ["Sled"], targetMuscles: ["Legs", "Full Body"], instructions: "Push a weighted sled for distance." },
  { name: "Stair Climber", description: "High intensity vertical cardio.", category: "Cardio", difficulty: "Beginner", equipment: ["Stair Climber"], targetMuscles: ["Legs", "Heart"], instructions: "Standard stair climbing motion." },
  { name: "Box Jumps", description: "Plyometric power movement.", category: "Cardio", difficulty: "Intermediate", equipment: ["Box"], targetMuscles: ["Legs", "Heart"], instructions: "Jump onto a box and step down." },
  { name: "Elliptical Trainer", description: "Low impact cardio.", category: "Cardio", difficulty: "Beginner", equipment: ["Elliptical"], targetMuscles: ["Heart", "Legs"], instructions: "Standard elliptical motion." },
  { name: "Shadow Boxing", description: "Great for coordination and cardio.", category: "Cardio", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Shoulders", "Heart"], instructions: "Punch the air with proper boxing form." },
  { name: "Spinning (Stationary Bike)", description: "Cycling for cardio.", category: "Cardio", difficulty: "Beginner", equipment: ["Stationary Bike"], targetMuscles: ["Legs", "Heart"], instructions: "Standard cycling motion." },
  { name: "Thrusters", description: "Squat into overhead press.", category: "Strength", difficulty: "Intermediate", equipment: ["Dumbbells", "Barbell"], targetMuscles: ["Legs", "Shoulders", "Heart"], instructions: "Perform a squat and press the weights overhead as you stand." },
  { name: "Swimming", description: "Full body, zero impact cardio.", category: "Cardio", difficulty: "Beginner", equipment: ["Pool"], targetMuscles: ["Full Body", "Heart"], instructions: "Swim laps." },

  // Flexibility & General
  { name: "Cat-Cow Stretch", description: "Spinal mobility.", category: "Flexibility", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Spine", "Back"], instructions: "Alternate between arching and rounding your back on all fours." },
  { name: "Child's Pose", description: "Restorative stretch.", category: "Flexibility", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Lower Back", "Shoulders"], instructions: "Kneel and reach forward, resting your forehead on the floor." },
  { name: "Pigeon Stretch", description: "Deep hip opener.", category: "Flexibility", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Hips", "Glutes"], instructions: "One leg bent in front, one straight behind." },
  { name: "Cobra Stretch", description: "Abdominal and spinal stretch.", category: "Flexibility", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Abs", "Lower Back"], instructions: "Lie on your stomach and push your chest up." },
  { name: "Downward Dog", description: "Classic yoga stretch.", category: "Flexibility", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Hamstrings", "Back", "Shoulders"], instructions: "V-shape with body, heels toward floor." },
  { name: "Farmer's Walk", description: "Grip strength and core stability.", category: "Strength", difficulty: "Beginner", equipment: ["Dumbbells", "Kettlebells"], targetMuscles: ["Forearms", "Core", "Traps"], instructions: "Hold heavy weights and walk for distance." },
  { name: "Turkish Get-Up", description: "Complex functional movement.", category: "Strength", difficulty: "Advanced", equipment: ["Kettlebell", "Dumbbell"], targetMuscles: ["Full Body", "Shoulders", "Core"], instructions: "Go from lying down to standing while holding a weight overhead." },
  { name: "Wall Sit", description: "Isometric quad endurance.", category: "Strength", difficulty: "Beginner", equipment: ["Wall"], targetMuscles: ["Quads"], instructions: "Sit against a wall with knees at 90 degrees." },
  { name: "Bear Crawl", description: "Functional movement for agility and core.", category: "General", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Full Body", "Core"], instructions: "Crawl on hands and feet close to the ground." },
  { name: "Sun Salutation", description: "Standard yoga sequence.", category: "Flexibility", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Full Body"], instructions: "Follow the yoga flow sequence." },
  { name: "Wall Slides", description: "Shoulder mobility.", category: "Flexibility", difficulty: "Beginner", equipment: ["Wall"], targetMuscles: ["Shoulders", "Upper Back"], instructions: "Slide arms up and down a wall while keeping them flat." },
  { name: "Scapular Pull-ups", description: "Shoulder health and pull-up preparation.", category: "Strength", difficulty: "Beginner", equipment: ["Pull-up Bar"], targetMuscles: ["Upper Back", "Shoulders"], instructions: "Hang and pull your shoulder blades down without bending arms." },
  { name: "Glute Ham Raise", description: "Advanced posterior chain builder.", category: "Strength", difficulty: "Advanced", equipment: ["GHR Machine"], targetMuscles: ["Hamstrings", "Glutes"], instructions: "Use the GHR machine to lower and raise your torso." },
  { name: "Single Leg RDL", description: "Balance and hamstring strength.", category: "Strength", difficulty: "Intermediate", equipment: ["Dumbbell", "Kettlebell"], targetMuscles: ["Hamstrings", "Glutes"], instructions: "Perform an RDL on one leg." },
  { name: "Lateral Lunges", description: "Side-to-side leg strength.", category: "Strength", difficulty: "Beginner", equipment: ["None", "Weight"], targetMuscles: ["Quads", "Glutes", "Adductors"], instructions: "Step to the side and lower hips." },
  { name: "Pull-up (Neutral Grip)", description: "Easier on shoulders, hits more brachialis.", category: "Strength", difficulty: "Intermediate", equipment: ["Pull-up Bar"], targetMuscles: ["Lats", "Biceps"], instructions: "Pull up with palms facing each other." },
  { name: "Chin-ups", description: "Biceps focused pull-up variation.", category: "Strength", difficulty: "Intermediate", equipment: ["Pull-up Bar"], targetMuscles: ["Biceps", "Lats"], instructions: "Pull up with palms facing you." },
  { name: "Superman", description: "Lower back and glute activation.", category: "Strength", difficulty: "Beginner", equipment: ["None"], targetMuscles: ["Lower Back", "Glutes"], instructions: "Lie face down and lift arms and legs simultaneously." },
  { name: "Russian Leg Curl", description: "Intense hamstring builder.", category: "Strength", difficulty: "Advanced", equipment: ["Partner or Bench"], targetMuscles: ["Hamstrings"], instructions: "Kneel and lower your torso forward slowly." },
  { name: "Plate Pinch", description: "Grip strength.", category: "Strength", difficulty: "Beginner", equipment: ["Weight Plates"], targetMuscles: ["Forearms"], instructions: "Pinch two plates together and hold." }
];
