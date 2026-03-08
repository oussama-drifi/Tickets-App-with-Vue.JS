<template>
    <div class="company-card skeleton">
        <div class="card-header">
            <div class="bone bone-icon"></div>
            <div class="header">
                <div class="bone bone-title"></div>
                <div class="bone bone-subtitle"></div>
            </div>
        </div>
        <div class="card-body">
            <div class="bone bone-line short"></div>
            <div class="bone bone-line"></div>
            <div class="bone bone-line"></div>
            <div class="bone bone-line"></div>
            <div class="bone bone-line medium"></div>
        </div>
        <div class="card-footer">
            <div class="bone bone-button"></div>
        </div>
    </div>
</template>

<style scoped>
.company-card {
    border: 2px solid #eee;
    border-radius: 15px;
    padding: 10px;
    background: #fff;
    margin: 0 4px;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 14px;
}

.card-body {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.card-footer {
    margin-top: 7px;
}

.bone {
    background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 6px;
}

.bone-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    flex-shrink: 0;
}

.bone-title {
    width: 160px;
    height: 14px;
}

.bone-subtitle {
    width: 220px;
    height: 10px;
    margin-top: 6px;
}

.bone-line {
    width: 100%;
    height: 10px;
}

.bone-line.short {
    width: 40%;
}

.bone-line.medium {
    width: 70%;
}

.bone-button {
    width: 100%;
    height: 40px;
    border-radius: 12px;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
</style>
