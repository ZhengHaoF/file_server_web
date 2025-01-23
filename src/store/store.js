import {defineStore} from 'pinia'

export const useAlertsStore = defineStore('alerts', {
    state: () => ({
        videoList: []
    }),
    getters: {

    },
    actions: {
        updateVideoList(newList) {
            this.videoList = [];
        }
    },
})