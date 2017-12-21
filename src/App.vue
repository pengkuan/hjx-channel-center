<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>

export default {
    name: 'app',
    created() {
        // console.log('app.vue执行了created')
    },
    mounted() {
    	// console.log('app.vue执行了mounted')
    }
}
</script> 
<style> 
</style>