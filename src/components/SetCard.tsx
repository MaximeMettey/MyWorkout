import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, TextInput, IconButton, Checkbox, useTheme, Chip } from 'react-native-paper';
import { WorkoutSet } from '../models';

interface SetCardProps {
  set: WorkoutSet;
  setNumber: number;
  previousSet?: { reps: number; weight: number };
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onDelete?: () => void;
  editable?: boolean;
}

export const SetCard: React.FC<SetCardProps> = ({
  set,
  setNumber,
  previousSet,
  onUpdate,
  onDelete,
  editable = true,
}) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(!set.completed);

  const handleComplete = () => {
    onUpdate({ completed: !set.completed });
    setIsEditing(false);
  };

  return (
    <Card
      style={[
        styles.card,
        set.completed && { backgroundColor: theme.colors.primaryContainer },
      ]}
    >
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.setNumber}>
            <Text variant="titleMedium" style={styles.setNumberText}>
              Série {setNumber}
            </Text>
            {previousSet && (
              <Text variant="bodySmall" style={styles.previousData}>
                Précédent: {previousSet.reps} × {previousSet.weight}kg
              </Text>
            )}
          </View>
          {editable && (
            <View style={styles.actions}>
              <Checkbox
                status={set.completed ? 'checked' : 'unchecked'}
                onPress={handleComplete}
              />
              {onDelete && (
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={onDelete}
                  iconColor={theme.colors.error}
                />
              )}
            </View>
          )}
        </View>

        <View style={styles.inputs}>
          <View style={styles.inputContainer}>
            <Text variant="bodySmall" style={styles.label}>
              Répétitions
            </Text>
            <TextInput
              mode="outlined"
              value={set.reps.toString()}
              onChangeText={(text) => onUpdate({ reps: parseInt(text) || 0 })}
              keyboardType="numeric"
              style={styles.input}
              disabled={!editable || set.completed}
              dense
            />
          </View>

          <View style={styles.inputContainer}>
            <Text variant="bodySmall" style={styles.label}>
              Poids (kg)
            </Text>
            <TextInput
              mode="outlined"
              value={set.weight.toString()}
              onChangeText={(text) => onUpdate({ weight: parseFloat(text) || 0 })}
              keyboardType="decimal-pad"
              style={styles.input}
              disabled={!editable || set.completed}
              dense
            />
          </View>

          {set.restTime && (
            <View style={styles.inputContainer}>
              <Text variant="bodySmall" style={styles.label}>
                Repos (s)
              </Text>
              <Chip icon="timer" style={styles.restChip}>
                {set.restTime}s
              </Chip>
            </View>
          )}
        </View>

        {set.notes && (
          <View style={styles.notesContainer}>
            <Text variant="bodySmall" style={styles.notes}>
              📝 {set.notes}
            </Text>
          </View>
        )}

        {set.rpe && (
          <View style={styles.rpeContainer}>
            <Text variant="bodySmall">
              RPE: {set.rpe}/10
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  setNumber: {
    flex: 1,
  },
  setNumberText: {
    fontWeight: 'bold',
  },
  previousData: {
    opacity: 0.6,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  inputContainer: {
    flex: 1,
    minWidth: 100,
  },
  label: {
    marginBottom: 4,
    opacity: 0.7,
  },
  input: {
    height: 40,
  },
  restChip: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  notesContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  notes: {
    fontStyle: 'italic',
  },
  rpeContainer: {
    marginTop: 8,
  },
});
