<style scoped>
    .r{
        width: 80%;
        padding: 20px;
        background-color: #fff;
    }
    
    .editor{
        height: 300px;
    }
</style>
<template>
    <div class="r">

        <Editor :content="content" @catchData="catchData"></Editor>

    </div>
</template>
<script>

    import Editor from './ue'

    export default{
        data(){
            return{
                content:''
            }
        },
        components:{Editor},
        methods:{
            

            catchData(value){
                this.content = value
            }
        },
        

    }
</script>