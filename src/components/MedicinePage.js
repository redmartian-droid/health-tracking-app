import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MedicinePage({
  medicines,
  toggleMedicine,
  addMedicine,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    times: [''],
  });

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.dosage && newMedicine.times[0]) {
      addMedicine({
        ...newMedicine,
        times: newMedicine.times.filter((time) => time),
      });
      setNewMedicine({ name: '', dosage: '', times: [''] });
      setShowAddForm(false);
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const addTimeSlot = () => {
    setNewMedicine({
      ...newMedicine,
      times: [...newMedicine.times, ''],
    });
  };

  const updateTimeSlot = (index, value) => {
    const newTimes = [...newMedicine.times];
    newTimes[index] = value;
    setNewMedicine({ ...newMedicine, times: newTimes });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medicine Tracker</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {medicines.length === 0 && !showAddForm && (
          <View style={styles.emptyState}>
            <Ionicons name="medical" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No medicines added yet</Text>
            <Text style={styles.emptySubtitle}>
              Click "Add" to start tracking your medications
            </Text>
          </View>
        )}

        {medicines.map((medicine) => (
          <View key={medicine.id} style={styles.medicineCard}>
            <View style={styles.medicineHeader}>
              <View>
                <Text style={styles.medicineName}>{medicine.name}</Text>
                <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
              </View>
              <View style={styles.medicineProgress}>
                <Ionicons name="medical" size={20} color="#8b5cf6" />
                <Text style={styles.progressText}>
                  {Object.values(medicine.taken).filter(Boolean).length} /{' '}
                  {medicine.times.length} taken
                </Text>
              </View>
            </View>

            <View style={styles.timesGrid}>
              {medicine.times.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    medicine.taken[time] && styles.timeButtonTaken,
                  ]}
                  onPress={() => toggleMedicine(medicine.id, time)}
                >
                  <View style={styles.timeContent}>
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={medicine.taken[time] ? '#166534' : '#6b7280'}
                    />
                    <Text
                      style={[
                        styles.timeText,
                        medicine.taken[time] && styles.timeTextTaken,
                      ]}
                    >
                      {time}
                    </Text>
                    {medicine.taken[time] && (
                      <Ionicons name="checkmark" size={16} color="#166534" />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.timeStatus,
                      medicine.taken[time] && styles.timeStatusTaken,
                    ]}
                  >
                    {medicine.taken[time] ? 'Taken' : 'Pending'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={showAddForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Medicine</Text>

            <Text style={styles.label}>Medicine Name</Text>
            <TextInput
              style={styles.input}
              value={newMedicine.name}
              onChangeText={(text) =>
                setNewMedicine({ ...newMedicine, name: text })
              }
              placeholder="Enter medicine name"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Dosage</Text>
            <TextInput
              style={styles.input}
              value={newMedicine.dosage}
              onChangeText={(text) =>
                setNewMedicine({ ...newMedicine, dosage: text })
              }
              placeholder="e.g., 10mg, 2 tablets"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Times</Text>
            <ScrollView style={styles.timesInputContainer}>
              {newMedicine.times.map((time, index) => (
                <TextInput
                  key={index}
                  style={styles.input}
                  value={time}
                  onChangeText={(text) => updateTimeSlot(index, text)}
                  placeholder="e.g., 08:00, Morning"
                  placeholderTextColor="#9ca3af"
                />
              ))}
              <TouchableOpacity
                style={styles.addTimeButton}
                onPress={addTimeSlot}
              >
                <Text style={styles.addTimeButtonText}>+ Add another time</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddMedicine}
              >
                <Text style={styles.submitButtonText}>Add Medicine</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  medicineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  medicineName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  medicineDosage: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  medicineProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeButton: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  timeButtonTaken: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  timeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  timeTextTaken: {
    color: '#166534',
  },
  timeStatus: {
    fontSize: 12,
    color: '#6b7280',
  },
  timeStatusTaken: {
    color: '#166534',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  timesInputContainer: {
    maxHeight: 150,
  },
  addTimeButton: {
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addTimeButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6b7280',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
