import * as SQLite from 'expo-sqlite';
import {
  Workout,
  WorkoutTemplate,
  UserProfile,
  BodyMeasurement,
  NutritionEntry,
  DailyNutritionGoal,
} from '../models';

const DATABASE_NAME = 'myworkout.db';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    // Table User Profile
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_profile (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        display_name TEXT,
        photo_url TEXT,
        birth_date TEXT,
        gender TEXT,
        height REAL,
        activity_level TEXT,
        goal TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Table Workouts
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        duration INTEGER,
        completed INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        template_id TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (template_id) REFERENCES workout_templates(id)
      );
    `);

    // Table Workout Exercises
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS workout_exercises (
        id TEXT PRIMARY KEY,
        workout_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        set_type TEXT NOT NULL DEFAULT 'normal',
        superset_group INTEGER,
        exercise_order INTEGER NOT NULL,
        notes TEXT,
        FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
      );
    `);

    // Table Workout Sets
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS workout_sets (
        id TEXT PRIMARY KEY,
        workout_exercise_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        set_number INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight REAL NOT NULL,
        rest_time INTEGER,
        completed INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        rpe INTEGER,
        FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE
      );
    `);

    // Table Workout Templates
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS workout_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        exercises_data TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Table Body Measurements
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS body_measurements (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        weight REAL,
        body_fat REAL,
        muscle_mass REAL,
        neck REAL,
        chest REAL,
        waist REAL,
        hips REAL,
        biceps REAL,
        thighs REAL,
        calves REAL,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES user_profile(id)
      );
    `);

    // Table Nutrition Entries
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS nutrition_entries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        description TEXT NOT NULL,
        calories REAL NOT NULL,
        protein REAL NOT NULL,
        carbs REAL NOT NULL,
        fat REAL NOT NULL,
        time TEXT,
        FOREIGN KEY (user_id) REFERENCES user_profile(id)
      );
    `);

    // Table Daily Nutrition Goals
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS daily_nutrition_goals (
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        calories_goal REAL NOT NULL,
        protein_goal REAL NOT NULL,
        carbs_goal REAL NOT NULL,
        fat_goal REAL NOT NULL,
        PRIMARY KEY (user_id, date),
        FOREIGN KEY (user_id) REFERENCES user_profile(id)
      );
    `);

    // Indexes pour optimiser les requêtes
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
      CREATE INDEX IF NOT EXISTS idx_body_measurements_date ON body_measurements(date);
      CREATE INDEX IF NOT EXISTS idx_nutrition_entries_date ON nutrition_entries(date);
    `);
  }

  // ==================== USER PROFILE ====================
  async createOrUpdateUserProfile(profile: UserProfile): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT OR REPLACE INTO user_profile
      (id, email, display_name, photo_url, birth_date, gender, height, activity_level, goal, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.id,
        profile.email,
        profile.displayName || null,
        profile.photoURL || null,
        profile.birthDate || null,
        profile.gender || null,
        profile.height || null,
        profile.activityLevel || null,
        profile.goal || null,
        profile.createdAt,
        profile.updatedAt,
      ]
    );
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<any>(
      'SELECT * FROM user_profile WHERE id = ?',
      [userId]
    );

    if (!result) return null;

    return {
      id: result.id,
      email: result.email,
      displayName: result.display_name,
      photoURL: result.photo_url,
      birthDate: result.birth_date,
      gender: result.gender,
      height: result.height,
      activityLevel: result.activity_level,
      goal: result.goal,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  }

  // ==================== WORKOUTS ====================
  async createWorkout(workout: Workout): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT INTO workouts (id, name, date, duration, completed, notes, template_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        workout.id,
        workout.name,
        workout.date,
        workout.duration || null,
        workout.completed ? 1 : 0,
        workout.notes || null,
        workout.templateId || null,
        new Date().toISOString(),
      ]
    );

    // Insérer les exercices et sets
    for (const exercise of workout.exercises) {
      await this.db.runAsync(
        `INSERT INTO workout_exercises (id, workout_id, exercise_id, set_type, superset_group, exercise_order, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          exercise.id,
          workout.id,
          exercise.exerciseId,
          exercise.setType,
          exercise.supersetGroup || null,
          exercise.order,
          exercise.notes || null,
        ]
      );

      for (const set of exercise.sets) {
        await this.db.runAsync(
          `INSERT INTO workout_sets (id, workout_exercise_id, exercise_id, set_number, reps, weight, rest_time, completed, notes, rpe)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            set.id,
            exercise.id,
            set.exerciseId,
            set.setNumber,
            set.reps,
            set.weight,
            set.restTime || null,
            set.completed ? 1 : 0,
            set.notes || null,
            set.rpe || null,
          ]
        );
      }
    }
  }

  async getWorkout(workoutId: string): Promise<Workout | null> {
    if (!this.db) throw new Error('Database not initialized');

    const workoutRow = await this.db.getFirstAsync<any>(
      'SELECT * FROM workouts WHERE id = ?',
      [workoutId]
    );

    if (!workoutRow) return null;

    const exercisesRows = await this.db.getAllAsync<any>(
      'SELECT * FROM workout_exercises WHERE workout_id = ? ORDER BY exercise_order',
      [workoutId]
    );

    const exercises = await Promise.all(
      exercisesRows.map(async (exRow) => {
        const setsRows = await this.db!.getAllAsync<any>(
          'SELECT * FROM workout_sets WHERE workout_exercise_id = ? ORDER BY set_number',
          [exRow.id]
        );

        return {
          id: exRow.id,
          exerciseId: exRow.exercise_id,
          setType: exRow.set_type,
          supersetGroup: exRow.superset_group,
          order: exRow.exercise_order,
          notes: exRow.notes,
          sets: setsRows.map((setRow) => ({
            id: setRow.id,
            exerciseId: setRow.exercise_id,
            setNumber: setRow.set_number,
            reps: setRow.reps,
            weight: setRow.weight,
            restTime: setRow.rest_time,
            completed: setRow.completed === 1,
            notes: setRow.notes,
            rpe: setRow.rpe,
          })),
        };
      })
    );

    return {
      id: workoutRow.id,
      name: workoutRow.name,
      date: workoutRow.date,
      duration: workoutRow.duration,
      completed: workoutRow.completed === 1,
      notes: workoutRow.notes,
      templateId: workoutRow.template_id,
      exercises,
    };
  }

  async getWorkoutsByDateRange(startDate: string, endDate: string): Promise<Workout[]> {
    if (!this.db) throw new Error('Database not initialized');

    const workoutsRows = await this.db.getAllAsync<any>(
      'SELECT * FROM workouts WHERE date >= ? AND date <= ? ORDER BY date DESC',
      [startDate, endDate]
    );

    return Promise.all(
      workoutsRows.map(async (row) => {
        const workout = await this.getWorkout(row.id);
        return workout!;
      })
    );
  }

  async updateWorkout(workout: Workout): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Supprimer les anciennes données
    await this.db.runAsync('DELETE FROM workout_exercises WHERE workout_id = ?', [workout.id]);

    // Mettre à jour le workout
    await this.db.runAsync(
      `UPDATE workouts SET name = ?, date = ?, duration = ?, completed = ?, notes = ? WHERE id = ?`,
      [workout.name, workout.date, workout.duration || null, workout.completed ? 1 : 0, workout.notes || null, workout.id]
    );

    // Réinsérer les exercices et sets
    for (const exercise of workout.exercises) {
      await this.db.runAsync(
        `INSERT INTO workout_exercises (id, workout_id, exercise_id, set_type, superset_group, exercise_order, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          exercise.id,
          workout.id,
          exercise.exerciseId,
          exercise.setType,
          exercise.supersetGroup || null,
          exercise.order,
          exercise.notes || null,
        ]
      );

      for (const set of exercise.sets) {
        await this.db.runAsync(
          `INSERT INTO workout_sets (id, workout_exercise_id, exercise_id, set_number, reps, weight, rest_time, completed, notes, rpe)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            set.id,
            exercise.id,
            set.exerciseId,
            set.setNumber,
            set.reps,
            set.weight,
            set.restTime || null,
            set.completed ? 1 : 0,
            set.notes || null,
            set.rpe || null,
          ]
        );
      }
    }
  }

  // ==================== BODY MEASUREMENTS ====================
  async createBodyMeasurement(measurement: BodyMeasurement): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT INTO body_measurements
      (id, user_id, date, weight, body_fat, muscle_mass, neck, chest, waist, hips, biceps, thighs, calves, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        measurement.id,
        measurement.userId,
        measurement.date,
        measurement.weight || null,
        measurement.bodyFat || null,
        measurement.muscleMass || null,
        measurement.neck || null,
        measurement.chest || null,
        measurement.waist || null,
        measurement.hips || null,
        measurement.biceps || null,
        measurement.thighs || null,
        measurement.calves || null,
        measurement.notes || null,
      ]
    );
  }

  async getBodyMeasurements(userId: string, limit = 50): Promise<BodyMeasurement[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM body_measurements WHERE user_id = ? ORDER BY date DESC LIMIT ?',
      [userId, limit]
    );

    return rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      date: row.date,
      weight: row.weight,
      bodyFat: row.body_fat,
      muscleMass: row.muscle_mass,
      neck: row.neck,
      chest: row.chest,
      waist: row.waist,
      hips: row.hips,
      biceps: row.biceps,
      thighs: row.thighs,
      calves: row.calves,
      notes: row.notes,
    }));
  }

  // ==================== NUTRITION ====================
  async createNutritionEntry(entry: NutritionEntry): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT INTO nutrition_entries
      (id, user_id, date, meal_type, description, calories, protein, carbs, fat, time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.id,
        entry.userId,
        entry.date,
        entry.mealType,
        entry.description,
        entry.calories,
        entry.protein,
        entry.carbs,
        entry.fat,
        entry.time || null,
      ]
    );
  }

  async getNutritionEntriesByDate(userId: string, date: string): Promise<NutritionEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM nutrition_entries WHERE user_id = ? AND date = ? ORDER BY time',
      [userId, date]
    );

    return rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      date: row.date,
      mealType: row.meal_type,
      description: row.description,
      calories: row.calories,
      protein: row.protein,
      carbs: row.carbs,
      fat: row.fat,
      time: row.time,
    }));
  }

  async setDailyNutritionGoal(goal: DailyNutritionGoal): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT OR REPLACE INTO daily_nutrition_goals
      (user_id, date, calories_goal, protein_goal, carbs_goal, fat_goal)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [goal.userId, goal.date, goal.caloriesGoal, goal.proteinGoal, goal.carbsGoal, goal.fatGoal]
    );
  }

  async getDailyNutritionGoal(userId: string, date: string): Promise<DailyNutritionGoal | null> {
    if (!this.db) throw new Error('Database not initialized');

    const row = await this.db.getFirstAsync<any>(
      'SELECT * FROM daily_nutrition_goals WHERE user_id = ? AND date = ?',
      [userId, date]
    );

    if (!row) return null;

    return {
      userId: row.user_id,
      date: row.date,
      caloriesGoal: row.calories_goal,
      proteinGoal: row.protein_goal,
      carbsGoal: row.carbs_goal,
      fatGoal: row.fat_goal,
    };
  }
}

export const database = new DatabaseService();
