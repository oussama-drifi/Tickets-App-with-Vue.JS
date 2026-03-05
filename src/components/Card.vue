<script setup>
import { onMounted, reactive, ref } from 'vue';
import Employee from '@/components/Employee.vue';

// Vue directives
// :prop="dynamic_value"(or: v-bind:prop="dynamic_val")
// Vue features
// ### in forms you can use: <form @submit.prevent="handler">
// onMounted(() => {}), onUnmounted(cleanup fun), watch(re-run effect)... instead of useEffect
// reactive() function:
// ======== 


const state = reactive({
    companyName: "MaxMind Agency",
    employees: [],
    status: 'active',
    location: "NYC alens street 356 App 5",
    link: "https://www.google.com/carrers/jobs",
    isLoading: true,
    
    // inputs
    newEmployeeName: '',
    newEmployeeSalary: 0,
    newEmployeeStartDate: 0,
    newStatus: ''
})

onMounted(async () => {
    await new Promise(res => setTimeout(res, 2000))

    state.employees = [
        {id: 1, name: "oussama", salary: 1500, startYear: 2010},
        {id: 2, name: "yassin", salary: 2500, startYear: 2017},
        {id: 3, name: "majid", salary: 3200, startYear: 2015}
    ]
    state.isLoading = false
})

const addEmployee = () => {
    state.employees.push({id: state.employees.length+1, name: state.newEmployeeName, salary: state.newEmployeeSalary, startYear: state.newEmployeeStartDate})
}
const changeStatus = () => {
    if (["suspended", "active", "inactive"].includes(state.newStatus)) state.status = state.newStatus
}

</script>

<template>
    <div class="company-card">
        <div class="card-header">
            <div class="icon">
                <span><i class="bi bi-building-fill"></i></span>
            </div>
            <div class="header">
                <span>{{ state.companyName }}</span>
                <p><i class="bi bi-geo"></i> {{ state.location }}</p>
            </div>
        </div>
        <div class="card-body">
            <div class="employees">
                <span><i class="bi bi-activity"></i> status: {{ state.status }}</span><br>
                <span><i class="bi bi-people"></i> employees</span>
                <ul class="employees-list">
                    <Employee v-for="emp in state.employees" :key="emp.id" v-bind:name="emp.name" :startYear="Number(emp.startYear)"/>
                </ul>
            </div>
            <div class="location">
                <span>
                    <i class="bi bi-link-45deg"></i> link <br> <a :href="state.link">{{ state.link }}</a>
                </span>
            </div>
        </div>
        <div class="card-footer">
            <button><i class="bi bi-envelope"></i> Contact now</button>
        </div>
    </div>
    <div class="input-field">
        <input type="text" name="newEmployeeName" placeholder="employee name" v-model="state.newEmployeeName">
        <input type="text" name="newEmployeeSalary" placeholder="salary" v-model="state.newEmployeeSalary">
        <input type="text" name="newEmployeeStartDate" placeholder="start date" v-model="state.newEmployeeStartDate">
        <button @click="addEmployee">add employee</button>

        <input type="text" placeholder="status" name="status" v-model="state.newStatus">
        <button @click="changeStatus">change status</button>
    </div>
</template>


<style scoped>
.company-card {
    border: 2px solid #eee;
    border-radius: 15px;
    padding: 10px;
    font-family: 'Poppins', sans-serif;
    background: #fff;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 14px;
}

.card-header .icon span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #f0f0f0;
    font-size: 1.2rem;
    color: #555;
}

.card-header .header span {
    font-weight: 600;
    font-size: 1.1rem;
    color: #222;
}

.card-header .header p {
    margin: 4px 0 0;
    font-size: 0.8rem;
    color: #888;
}

.card-body {
    margin-top: 16px;
}

.employees span {
    font-weight: 600;
    font-size: 0.9rem;
    color: #444;
}

.employees-list {
    list-style: none;
    padding: 0;
    margin: 8px 0 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.employees-list li {
    font-size: 0.85rem;
    color: #555;
    padding-left: 8px;
}

.location {
    margin-top: 8px;
    font-size: 0.85rem;
    color: #555;
}

.location span a {
    color: #383838;
    text-decoration: none;
    word-break: break-all;
}

.location a:hover {
    text-decoration: underline;
}

.card-footer {
    margin-top: 7px;
}

.card-footer button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 12px;
    background: #222;
    color: #fff;
    font-family: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s;
}

.card-footer button:hover {
    background: #444;
}
</style>