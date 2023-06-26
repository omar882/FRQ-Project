<script setup>
    defineProps({
    })

    const visible = ref(false);
</script>

<script>
    import { ref } from "vue";
    import { globals, dataModel } from '../dataModel.js'

    export default {
        data() {
            return {
                dataModel
            }
        },
        methods: {
        }
    }

</script>

<template>
    <div class="card" style="width:100%">
        <div class="flex justify-content-between flex-wrap card-container purple-container">
            <div class="flex justify-content-center w-4rem h-4rem font-bold text-white border-round m-2">
                <Sidebar v-model:visible="visible">
                    <h2>Sidebar</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </Sidebar>
                <Button icon="pi pi-bars" @click="visible=true" text/>
            </div>
            <div class="flex justify-content-center w-4rem h-4rem bg-purple-500 font-bold text-white border-round m-2">
                <Image src="logo.png" class="card flex align-items-center justify-content-center" alt="Image" width="80" />
            </div>
            <div class="flex align-items-center justify-content-center w-4rem h-4rem font-bold text-white border-round m-2"></div>
        </div>
    </div>

</template>
