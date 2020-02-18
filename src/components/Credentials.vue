<template>
    <div>
        <AwsForm v-bind:user="user" />
    </div>
</template>

<script>
    import AwsForm from "./forms/AwsForm";

    export default {
        name: "Credentials",
        components: {AwsForm},
        props: {
            user: Object
        }
    }
</script>

<style scoped>

</style>