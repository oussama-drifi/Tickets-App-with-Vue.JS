<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
    commercialId: {
        type: Number,
        default: 0,
    }, 
    name: {
        type: String,
        default: "username"
    },
    email: {
        type: String,
        default: "user email"
    },
    bio: {
        type: String,
        default: "user bio"
    },
    status: {
        type: String,
        default: "user status"
    },
    image: {
        type: String,
        default: "user profile image"
    }
})
</script>

<template>
    <div class="commercial-card">
        <div class="card-header">
            <div class="profile-image">
                <img v-if="image" :src="`${import.meta.env.VITE_API_URL}/${image}`" alt="profile">
                <img v-else src="/defaultProfile.png" alt="profile">
            </div>
            <div class="header">
                <h3>{{ name }}</h3>
                <span>{{ email }}</span>
            </div>
        </div>
        <div class="card-body">
            <div class="bio">
                {{ bio  }}
            </div>
        </div>
        <div class="card-footer">
            <button @click="router.push({name: 'commercial-details', params: {id: commercialId} })"><span>see tickets<i class="bi bi-arrow-up-right"></i></span></button>
        </div>
    </div>
</template>

<style scoped>
.commercial-card {
    border: 2px solid var(--border);
    border-radius: 15px;
    padding: 10px;
    background: var(--surface);
    display: flex;
    flex-direction: column;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 14px;
}

.profile-image img {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    object-fit: cover;
    flex-shrink: 0;
}
.header {
    min-width: 0;
}
.header h3 {
    line-height: 1.2;
    text-transform: lowercase;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.header span {
    font-size: 14px;
    color: var(--text-muted);
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.card-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
}

.bio {
    font-size: 12px;
    line-height: 1.6;
    color: #555;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: calc(2 * 1.6em);
}

.card-footer {
    margin-top: 7px;
}

.card-footer button {
    position: relative;
    width: 100%;
    height: 40px;
    border-radius: 9px;
    border: none;
    background: var(--primary);
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    text-transform: capitalize;
    font-weight: 600;
    transition-duration: 0.3s;
}
.card-footer button span {
    transition-duration: 0.3s;
    i {
        position: absolute;
        transition-duration: 0.3s;
        opacity: 0;
        font-size: 14px;
    }
}

.card-footer button:hover {
    opacity: 0.9;
    & span {
        padding-right: 5px;
        & i {
            opacity: 1;
        }
    }
}

/* @media ( 1500px <= width <= 1700px ) {
    .commercial-card {
        width: calc(100%/6 - 10px);
    }
}
@media ( width >= 1701 ) {
    .commercial-card {
        width: calc(100%/7);
    }
} */

</style>