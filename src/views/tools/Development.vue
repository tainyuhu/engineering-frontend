<template>
    <v-container>
        <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="6">
            <v-card class="mx-auto my-auto" elevation="2">
            <v-card-text class="text-center">
                <h3 style="margin-top: 20px; margin-bottom: 10px;">頁面開發中</h3>
                <p style="margin-bottom: 20px;">我們的新功能正在緊鑼密鼓地開發中，敬請期待！</p>
                <v-btn class="font-weight-bold" color="blue lighten-2" @click="goBack">返回</v-btn>
            </v-card-text>
            </v-card>
        </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
name: 'AddNewPlan',
methods: {
    goBack() {
    this.$router.go(-1);
    }
}
};
</script>

<style scoped>
.v-card {
    padding: 20px;
    background-color: #FFFFFF;
    border-radius: 10px;
}
</style>

  