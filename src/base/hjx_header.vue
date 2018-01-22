<template>
    <div class="label clear">
        <span class="hjx-fl">{{label}}</span>
        <span class="hjx-fr"><slot></slot></span>
    </div>
</template>
<script type="text/javascript">
export default {
    name:'hjxHeader',
    data() {
        return {}
    },
    props: {
        label: {
            type: String,
            required: true
        }
    },
    methods: {
        
    }
}

</script>
<style type="text/css" scoped="scoped">
	.label{
		margin: 0px auto 12px auto;
        padding-bottom: 12px;
        height: 20px;
        line-height: 20px;
        border-bottom: 1px dashed #eee;
        color: #878d99;
        font-size: 15px;
	}
</style>
