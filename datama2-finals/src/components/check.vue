<script setup>
import { ref, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://cfmkrihszjfptnnqvfbw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbWtyaWhzempmcHRubnF2ZmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MjI0NTcsImV4cCI6MjA1NjI5ODQ1N30.BdqbosyU8HTbGuihu9ZN3LuaNM0XlNfAn1uGz3Nfr7o');
const appointments = ref([]);
const userType = ref('customer');
const newAppointment = ref({ APPT_Date: '', APPT_Client_Name: '', APPT_Dentist_Name: '', APPT_Type: '' });

const fetchAppointments = async () => {
  let { data, error } = await supabase.from('APPOINTMENT').select('*');
  if (!error) appointments.value = data;
};

const bookAppointment = async () => {
  if (!newAppointment.value.APPT_Date || !newAppointment.value.APPT_Client_Name || !newAppointment.value.APPT_Dentist_Name || !newAppointment.value.APPT_Type) {
    alert('Please fill in all fields.');
    return;
  }
  let { error } = await supabase.from('APPOINTMENT').insert([{ ...newAppointment.value, APPT_Status: 'Pending' }]);
  if (!error) {
    alert('Appointment booked successfully!');
    newAppointment.value = { APPT_Date: '', APPT_Client_Name: '', APPT_Dentist_Name: '', APPT_Type: '' };
    fetchAppointments();
  }
};

const updateStatus = async (id, status) => {
  let { error } = await supabase.from('APPOINTMENT').update({ APPT_Status: status }).match({ APPT_ID: id });
  if (!error) fetchAppointments();
};

onMounted(fetchAppointments);
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dental Appointment System</h1>
        <select v-model="userType" class="border p-2">
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      <div v-if="userType === 'customer'" class="border p-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2">Book an Appointment</h2>
        <input v-model="newAppointment.APPT_Date" type="date" class="border p-2 mb-2 w-full" />
        <input v-model="newAppointment.APPT_Client_Name" placeholder="Your Name" class="border p-2 mb-2 w-full" />
        <input v-model="newAppointment.APPT_Dentist_Name" placeholder="Dentist Name" class="border p-2 mb-2 w-full" />
        <input v-model="newAppointment.APPT_Type" placeholder="Appointment Type" class="border p-2 mb-2 w-full" />
        <button @click="bookAppointment" class="bg-blue-500 text-white p-2 rounded w-full">Book</button>
      </div>

      <div v-if="userType === 'staff'" class="border p-4 mt-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2">Manage Appointments</h2>
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-200">
              <th class="p-2">Date</th>
              <th class="p-2">Client</th>
              <th class="p-2">Dentist</th>
              <th class="p-2">Type</th>
              <th class="p-2">Status</th>
              <th class="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appt in appointments" :key="appt.APPT_ID" class="border-b">
              <td class="p-2">{{ appt.APPT_Date }}</td>
              <td class="p-2">{{ appt.APPT_Client_Name }}</td>
              <td class="p-2">{{ appt.APPT_Dentist_Name }}</td>
              <td class="p-2">{{ appt.APPT_Type }}</td>
              <td class="p-2">{{ appt.APPT_Status }}</td>
              <td class="p-2">
                <button @click="updateStatus(appt.APPT_ID, 'Confirmed')" class="bg-green-500 text-white p-1 rounded">Confirm</button>
                <button @click="updateStatus(appt.APPT_ID, 'Cancelled')" class="bg-red-500 text-white p-1 rounded ml-2">Cancel</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  color: #2c3e50;
  font-size: 2rem;
}

.border {
  border: 1px solid #ccc;
  padding: 1rem;
}

button {
  transition: transform 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
}
</style>
