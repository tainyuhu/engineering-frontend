<template>
    <div v-if="error && showMessage" class="error-message">
        <p>{{ errorMessage }}</p>
    </div>
</template>

<script>
export default {
props: {
    error: {
        type: Object,
        default: null
    }
},
computed: {
    showMessage() {
        return !!this.error;
    },
    errorMessage() {
        if (!this.error) return '';

        // 根據不同的錯誤類型或狀態碼制定錯誤訊息
        if (this.error.response) {
            // HTTP 響應錯誤 (從服務器接受到響應)
            switch (this.error.response.status) {
            case 404:
                return '你要的內容未找到。';
            case 500:
                return '系統內部錯誤，請稍後再嘗試，仍有錯誤請洽後台管理員。';
            default:
                return this.error.response.data.message || '發生未知錯誤。';
            }
        } else if (this.error.request) {
            // 請求已發出，但未收到回應
            return '系統未響應，可能是網路問題，試著刷新頁面。';
        } else {
            // 設置請求時發生了一些問題
            return '請求失敗: ' + this.error.message;
        }
    }
}
};
</script>

<style scoped>
.error-message {
    color: red;
}
</style>
  