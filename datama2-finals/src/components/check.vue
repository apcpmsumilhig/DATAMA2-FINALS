<template>
  <div id="app">
    <h1>Dental Clinic Management</h1>

    <div class="section">
      <h2>Manage Appointments</h2>
      <form @submit.prevent="bookAppointment">
        <input v-model="newAppointment.APPT_Date" type="date" required />
        <input v-model="newAppointment.APPT_Client_Name" type="text" placeholder="Client Name" required />
        <input v-model="newAppointment.APPT_Dentist_Name" type="text" placeholder="Dentist Name" required />
        <input v-model="newAppointment.APPT_Type" type="text" placeholder="Appointment Type" required />
        <button type="submit">Book Appointment</button>
      </form>
      <ul>
        <li v-for="appt in appointments" :key="appt.APPT_ID">
          {{ appt.APPT_Date }} - {{ appt.APPT_Client_Name }} - {{ appt.APPT_Dentist_Name }} - {{ appt.APPT_Status }}
          <button class="delete-button" @click="deleteAppointment(appt.APPT_ID)">Delete</button>
        </li>
      </ul>
    </div>

    <div class="section">
      <h2>Manage Clients</h2>
      <form @submit.prevent="addClient">
        <input v-model="newClient.CLIENT_Name" type="text" placeholder="Client Name" required />
        <input v-model="newClient.CLIENT_Contact_No" type="text" placeholder="Contact No" required />
        <input v-model="newClient.CLIENT_Address" type="text" placeholder="Address" required />
        <input v-model="newClient.CLIENT_Med_Record" type="text" placeholder="Medical Record" required />
        <button type="submit">Add Client</button>
      </form>
      <ul>
        <li v-for="client in clients" :key="client.CLIENT_ID">
          {{ client.CLIENT_Name }} - {{ client.CLIENT_Contact_No }}
          <button class="delete-button" @click="deleteClient(client.CLIENT_ID)">Delete</button>
        </li>
      </ul>
    </div>

    <div class="section">
      <h2>Manage Transactions</h2>
      <form @submit.prevent="addTransaction">
        <input v-model="newTransaction.TRAN_Date" type="date" required />
        <input v-model="newTransaction.TRAN_Client_Name" type="text" placeholder="Client Name" required />
        <input v-model="newTransaction.TRAN_Method" type="text" placeholder="Payment Method" required />
        <input v-model="newTransaction.TRAN_Staff_Name" type="text" placeholder="Staff Name" required />
        <input v-model="newTransaction.TRAN_Amount" type="text" placeholder="Amount" required />
        <button type="submit">Add Transaction</button>
      </form>
      <ul>
        <li v-for="tran in transactions" :key="tran.TRAN_ID">
          {{ tran.TRAN_Date }} - {{ tran.TRAN_Client_Name }} - {{ tran.TRAN_Amount }}
          <button class="delete-button" @click="deleteTransaction(tran.TRAN_ID)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient('https://ebixepumsdzubodxrvsz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaXhlcHVtc2R6dWJvZHhydnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMzA5NDUsImV4cCI6MjA1NjkwNjk0NX0.YinlAlZDaKlfMZDsqmNu3Wj9913Ld9Uda9ZYF1uaLYg');

// Reactive references for data
const appointments = ref([]);
const clients = ref([]);
const transactions = ref([]);

const newAppointment = ref({ APPT_Date: '', APPT_Client_Name: '', APPT_Dentist_Name: '', APPT_Type: '', APPT_Status: 'Scheduled' });
const newClient = ref({ CLIENT_Name: '', CLIENT_Contact_No: '', CLIENT_Address: '', CLIENT_Med_Record: '' });
const newTransaction = ref({ TRAN_Date: '', TRAN_Client_Name: '', TRAN_Method: '', TRAN_Staff_Name: '', TRAN_Amount: '' });

// Fetch all appointments
const fetchAppointments = async () => {
  const { data, error } = await supabase.from('APPOINTMENT').select('*');
  if (error) {
    console.error('Error fetching appointments:', error);
  } else {
    appointments.value = data;
  }
};

// Fetch all clients
const fetchClients = async () => {
  const { data, error } = await supabase.from('CLIENT').select('*');
  if (error) {
    console.error('Error fetching clients:', error);
  } else {
    clients.value = data;
  }
};

// Fetch all transactions
const fetchTransactions = async () => {
  const { data, error } = await supabase.from('TRANSACTION').select('*');
  if (error) {
    console.error('Error fetching transactions:', error);
  } else {
    transactions.value = data;
  }
};

// Book a new appointment
const bookAppointment = async () => {
  if (!newAppointment.value.APPT_Date || !newAppointment.value.APPT_Client_Name || !newAppointment.value.APPT_Dentist_Name || !newAppointment.value.APPT_Type) {
    alert('Please fill in all fields.');
    return;
  }
  const { error } = await supabase.from('APPOINTMENT').insert([{ ...newAppointment.value, APPT_Status: 'Pending' }]);
  if (error) {
    console.error('Error booking appointment:', error);
  } else {
    alert('Appointment booked successfully!');
    newAppointment.value = { APPT_Date: '', APPT_Client_Name: '', APPT_Dentist_Name: '', APPT_Type: '', APPT_Status: 'Scheduled' };
    fetchAppointments();
  }
};

// Add a new client
const addClient = async () => {
  if (!newClient.value.CLIENT_Name || !newClient.value.CLIENT_Contact_No || !newClient.value.CLIENT_Address || !newClient.value.CLIENT_Med_Record) {
    alert('Please fill in all fields.');
    return;
  }
  const { error } = await supabase.from('CLIENT').insert([newClient.value]);
  if (error) {
    console.error('Error adding client:', error);
  } else {
    alert('Client added successfully!');
    newClient.value = { CLIENT_Name: '', CLIENT_Contact_No: '', CLIENT_Address: '', CLIENT_Med_Record: '' };
    fetchClients();
  }
};

// Add a new transaction
const addTransaction = async () => {
  if (!newTransaction.value.TRAN_Date || !newTransaction.value.TRAN_Client_Name || !newTransaction.value.TRAN_Method || !newTransaction.value.TRAN_Staff_Name || !newTransaction.value.TRAN_Amount) {
    alert('Please fill in all fields.');
    return;
  }
  const { error } = await supabase.from('TRANSACTION').insert([newTransaction.value]);
  if (error) {
    console.error('Error adding transaction:', error);
  } else {
    alert('Transaction added successfully!');
    newTransaction.value = { TRAN_Date: '', TRAN_Client_Name: '', TRAN_Method: '', TRAN_Staff_Name: '', TRAN_Amount: '' };
    fetchTransactions();
  }
};

// Delete an appointment
const deleteAppointment = async (id) => {
  const { error } = await supabase.from('APPOINTMENT').delete().match({ APPT_ID: id });
  if (error) {
    console.error('Error deleting appointment:', error);
  } else {
    fetchAppointments();
  }
};

// Delete a client
const deleteClient = async (id) => {
  const { error } = await supabase.from('CLIENT').delete().match({ CLIENT_ID: id });
  if (error) {
    console.error('Error deleting client:', error);
  } else {
    fetchClients();
  }
};

// Delete a transaction
const deleteTransaction = async (id) => {
  const { error } = await supabase.from('TRANSACTION').delete().match({ TRAN_ID: id });
  if (error) {
    console.error('Error deleting transaction:', error);
  } else {
    fetchTransactions();
  }
};

// Real-time subscriptions
const subscribeToRealTimeData = () => {
  supabase
    .from('APPOINTMENT')
    .on('INSERT', fetchAppointments)
    .on('DELETE', fetchAppointments)
    .subscribe();

  supabase
    .from('CLIENT')
    .on('INSERT', fetchClients)
    .on('DELETE', fetchClients)
    .subscribe();

  supabase
    .from('TRANSACTION')
    .on('INSERT', fetchTransactions)
    .on('DELETE', fetchTransactions)
    .subscribe();
};

// Lifecycle hook to fetch data on component mount
onMounted(() => {
  fetchAppointments();
  fetchClients();
  fetchTransactions();
  subscribeToRealTimeData();
});
</script>

<style>
.section {
  margin-bottom: 20px;
}

h1 {
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  max-width: 40%; /* Set max-width to 40% for input fields */
  width: 100%;
  margin: 5 px 0;
  padding: 10px;
  font-size: 16px;
}

button {
  max-width: 10%; /* Set max-width to 5% for buttons */
  width: 100%;
  margin: 5px 0;
  padding: 10px;
  font-size: 16px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>