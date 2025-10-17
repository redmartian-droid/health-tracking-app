import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function MedicinePage({ medicines, toggleMedicine, addMedicine }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    times: [],
  });

  const timeOptions = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage || newMedicine.times.length === 0) {
      Alert.alert('Error', 'Please fill in all fields and select at least one time.');
      return;
    }

    addMedicine({
      id: Date.now(),
      ...newMedicine,
    });

    setNewMedicine({ name: '', dosage: '', times: [] });
    setShowAddModal(false);
  };

  const toggleTime = (time) => {
    setNewMedicine(prev => ({
      ...prev,
      times: prev.times.includes(time)
        ? prev.times.filter(t => t !== time)
        : [...prev.times, time]
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Medicine Tracker</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Icon name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Medicine List */}
        {medicines.map(medicine => (
          <View key={medicine.id} style={styles.medicineCard}>
            <View style={styles.medicineHeader}>
              <Icon name="medication" size={24} color="#10b981" />
              <View style={styles.medicineInfo}>
                <Text style={styles.medicineName}>{medicine.name}</Text>
                <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
              </View>
            </View>

            <View style={styles.timesContainer}>
              {medicine.times.map(time => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    medicine.taken[time] && styles.timeButtonTaken,
                  ]}
                  onPress={() => toggleMedicine(medicine.id, time)}
                >
                  <Text
                    style={[
                      styles.timeButtonText,
                      medicine.taken[time] && styles.timeButtonTextTaken,
                    ]}
                  >
                    {time}
                  </Text>
                  {medicine.taken[time] && (
                    <Icon name="check" size={16} color="#065f46" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {medicines.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="medication" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No medicines added yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first medicine
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Medicine Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Medicine</Text>
            <TouchableOpacity onPress={handleAddMedicine}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Medicine Name</Text>
              <TextInput
                style={styles.textInput}
                value={newMedicine.name}
                onChangeText={(text) => setNewMedicine(prev => ({ ...prev, name: text }))}
                placeholder="Enter medicine name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dosage</Text>
              <TextInput
                style={styles.textInput}
                value={newMedicine.dosage}
                onChangeText={(text) => setNewMedicine(prev => ({ ...prev, dosage: text }))}
                placeholder="e.g., 500mg, 1 tablet"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Times</Text>
              <View style={styles.timeOptionsContainer}>
                {timeOptions.map(time => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      newMedicine.times.includes(time) && styles.timeOptionSelected,
                    ]}
                    onPress={() => toggleTime(time)}
                  >
                    <Text
                      style={[
                        styles.timeOptionText,
                        newMedicine.times.includes(time) && styles.timeOptionTextSelected,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
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
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#10b981',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  medicineInfo: {
    marginLeft: 12,
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  medicineDosage: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  timeButtonTaken: {
    backgroundColor: '#d1fae5',
  },
  timeButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  timeButtonTextTaken: {
    color: '#065f46',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  saveButton: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  timeOptionSelected: {
    backgroundColor: '#10b981',
  },
  timeOptionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  timeOptionTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
