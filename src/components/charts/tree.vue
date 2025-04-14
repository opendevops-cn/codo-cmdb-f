<template>
  <div ref="dom" class="charts chart-tree" />
</template>

<script>
import echarts from 'echarts'
// import tdTheme from "./theme.json";
import { on, off } from './tools'
// echarts.registerTheme("tdTheme", tdTheme); //开了就不显示了
export default {
    name: 'ChatTree',
    props: {
        title: String,
        data: Object,
    },
    data() {
        return {
            dom: null,
        }
    },
    mounted() {
    // const data = {
    //   name: "flare",
    //   children: [
    //     {
    //       name: "flex",
    //       children: [{ name: "FlareVis", value: 4116 }],
    //     },
    //     {
    //       name: "scale",
    //       children: [
    //         { name: "IScaleMap", value: 2105 },
    //         { name: "LinearScale", value: 1316 },
    //         { name: "LogScale", value: 3151 },
    //         { name: "OrdinalScale", value: 3770 },
    //         { name: "QuantileScale", value: 2435 },
    //         { name: "QuantitativeScale", value: 4839 },
    //         { name: "RootScale", value: 1756 },
    //         { name: "Scale", value: 4268 },
    //         { name: "ScaleType", value: 1821 },
    //         { name: "TimeScale", value: 5833 },
    //       ],
    //     },
    //     {
    //       name: "display",
    //       children: [{ name: "DirtySprite", value: 8833 }],
    //     },
    //   ],
    // };

        this.$nextTick(() => {
            const { title } = this // Tree标题
            const { data } = this // 属性传参过来的Dict  TreeData
            // let xAxisData = Object.keys(this.value);
            // let seriesData = Object.values(this.value);
            const option = {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove',
                },
                legend: {
                    top: '2%',
                    left: '3%',
                    orient: 'vertical',
                    data: [
                        {
                            name: title,
                            icon: 'rectangle', // title的显示icon
                        },
                    ],
                    borderColor: '#c23531',
                },
                series: [
                    {
                        type: 'tree',
                        initialTreeDepth:4,
                        name: title,

                        data: [data],

                        top: '5%',
                        left: '7%',
                        bottom: '2%',
                        right: '60%',

                        symbolSize: 8,

                        label: {
                            position: 'left',
                            verticalAlign: 'middle',
                            align: 'right',
                        },

                        leaves: {
                            label: {
                                position: 'right',
                                verticalAlign: 'middle',
                                align: 'left',
                            },
                        },

                        expandAndCollapse: true,

                        animationDuration: 550,
                        animationDurationUpdate: 750,
                    },
                ],
            }
            this.dom = echarts.init(this.$refs.dom, 'tdTheme')
            this.dom.hideLoading()
            this.dom.setOption(option)
            on(window, 'resize', this.resize)
        })
    },
    beforeDestroy() {
        off(window, 'resize', this.resize)
    },
    methods: {
        resize() {
            this.dom.resize()
        },
    },
}
</script>
