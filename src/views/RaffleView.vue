<template>
    <div class="raffle-view">
        <div class="config-item" v-for="item in ballInfoViewList" :key="item.id">
            <div class="config-label">
                <span :style="{color: item.fontColor}">{{item.ballName}}</span>{{item.label}}
            </div>
            <div class="config-input">
                <el-input
                    v-model="ballConfigInfoValue[item.id]"
                    type="number"
                    class="input"
                    @input="(val: number) => inputValueChange(item.id, val)"
                    @blur="inputValueBlur(item.id)"
                />
            </div>
        </div>
        <div class="config-item">
            <el-radio-group v-model="raffleType" @change="raffleTypeChange">
                <el-radio label="1">正常抽选</el-radio>
                <el-radio label="2">快速抽选</el-radio>
            </el-radio-group>
        </div>
        <div class="config-item">
            <el-radio-group v-model="raffleWay" @change="raffleWayChange">
                <el-radio label="1">中间抽取</el-radio>
                <el-radio label="2">随机抽取</el-radio>
            </el-radio-group>
        </div>
        <div class="config-item">
            <template v-for="(item, i) in curShuffleArr" :key="i">
                <div :class="['circleall_1lvti', selectBlueFlag ? 'blue_ball' : 'red_ball', curShuffleIndex === i ? 'yellow_ball' : '']">
                    <span class="number_2xOZd">
                        {{item}}
                    </span>
                </div>
            </template>
        </div>
        <template v-if="raffleType == '1'">
            <div class="config-item" v-if="isShuffleFlag">
                <el-button type="primary" @click="selectBall">选球</el-button>
            </div>
            <div class="config-item" v-else>
                <el-button type="primary" @click="startShuffle">开始旋转</el-button>
            </div>
        </template>
        <template v-else-if="raffleType == '2'">
            <div class="config-item">
                <el-button type="primary" @click="quickExtraction">点击生成</el-button>
            </div>
        </template>
        <div class="config-item">
            <div class="content-mt_MYG2H">
                <template v-for="(item, i) in selectedNumberArr" :key="i">
                    <div :class="['circleall_1lvti', i < ballConfigInfoValue.redSeveralInput ? 'red_ball' : 'blue_ball']">
                        <span class="number_2xOZd">
                            {{item}}
                        </span>
                    </div>
                </template>
            </div>
        </div>
        <div class="config-item">
            <el-button type="primary" link @click="cleanViewFindlyArr">清空结果</el-button> 抽选结果(时间↓)：
        </div>
        <div class="config-item">
            <div class="content-mt_MYG2H" v-for="(item, index) in viewFindlyArr" :key="index">
                <template v-for="(el, i) in item" :key="i">
                    <div :class="['circleall_1lvti', i < ballConfigInfoValue.redSeveralInput ? 'red_ball' : 'blue_ball']">
                        <span class="number_2xOZd">
                            {{el}}
                        </span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {ref, reactive} from 'vue';
    import _ from 'lodash';
    
    interface BallConfigInfoValueType {
        redMaxValueInput: number;
        redSeveralInput: number;
        blueMaxValueInput: number;
        blueSeveralInput: number;
    }
    type BallConfigInfoValueKeys = keyof BallConfigInfoValueType;
    interface BallInfoViewListType {
        id: BallConfigInfoValueKeys;
        ballName?: string;
        fontColor?: string;
        label?: string;
    }
    type ballArrType = number[];

    // 洗球定时器
    let shuffleBallTime: number | null = null;
    // 最终不选择球的定时器
    let stopShuffleBallTime: number | null = null;

    // 抽选的范围及球号
    let redArr: ballArrType = [];
    let blueArr: ballArrType = [];
    
    // 默认球的配置
    const defaultBallInfo = {
        redMaxValueInput: 33,
        redSeveralInput: 6,
        blueMaxValueInput: 16,
        blueSeveralInput: 1,
    }
    // 抽选类型
    const raffleType = ref("1"); // 1.正常抽选 2.快速抽选
    // 取球方式
    const raffleWay = ref("1"); // 1.中间抽取 2.随机抽取
    // 球的展示列表
    const ballInfoViewList: BallInfoViewListType[] = reactive([
        {id: "redMaxValueInput", ballName: "红球", fontColor: "red", label: "取值范围："},
        {id: "blueMaxValueInput", ballName: "蓝球", fontColor: "blue", label: "取值范围："},
        {id: "redSeveralInput", ballName: "红球", fontColor: "red", label: "个数："},
        {id: "blueSeveralInput", ballName: "蓝球", fontColor: "blue", label: "个数："},
    ]);
    // 球的信息
    const ballConfigInfoValue: BallConfigInfoValueType = reactive({
        redMaxValueInput: defaultBallInfo.redMaxValueInput,
        redSeveralInput: defaultBallInfo.redSeveralInput,
        blueMaxValueInput: defaultBallInfo.blueMaxValueInput,
        blueSeveralInput: defaultBallInfo.blueSeveralInput,
    });

    // 是否正在洗牌
    const isShuffleFlag = ref(false);
    // 当前轮次的抽球范围及球号
    let curShuffleArr = ref<ballArrType>([]);
    // 当前取出的球索引下标
    const curShuffleIndex = ref<null | number>(null);
    // 抽选出的球
    let selectedNumberArr: ballArrType = reactive([]);
    // 是否选取蓝球
    const selectBlueFlag = ref<boolean>(false);

    // 多次抽选球结果
    const viewFindlyArr = ref<ballArrType[]>([]);

    // 清除洗球定时器
    const clearShuffleBallTime = () => {
        if (shuffleBallTime !== null) {
            clearInterval(shuffleBallTime);
            shuffleBallTime = null;
        }
    }
    // 清除最终不选择球的定时器
    const clearStopShuffleBallTime = () => {
        if (stopShuffleBallTime) {
            clearTimeout(stopShuffleBallTime);
            stopShuffleBallTime = null;
        }
    }

    // 配置变动重新开始
    const configChange = () => {
        // 清除定时器
        clearShuffleBallTime();
        clearStopShuffleBallTime();
        // 停止洗球
        isShuffleFlag.value = false;
        // 清空当前轮次的抽球范围及球号
        curShuffleArr.value = [];
        // 清空抽选出的球
        selectedNumberArr = [];
        // 重置取出的球索引下标
        curShuffleIndex.value = null;
        // 是否选取蓝球
        selectBlueFlag.value = false;
    };

    // 最大值变化
    const inputValueChange = (type: BallConfigInfoValueKeys, value: number) => {
        ballConfigInfoValue[type] = Number(value);
        configChange();
    };
    // 最大值失焦
    const inputValueBlur = (type: BallConfigInfoValueKeys) => {
        if (!isNaN(Number(ballConfigInfoValue[type])) && Number(ballConfigInfoValue[type]) < 1) {
            ballConfigInfoValue[type] = Number(defaultBallInfo[type]);
        }
    };
    // 抽选方式变化
    const raffleTypeChange = (value: string) => {
        raffleType.value = value;
        configChange();
    };
    // 取球方式变化
    const raffleWayChange = (value: string) => {
        raffleWay.value = value;
        // configChange();
    };

    // 清空结果
    const cleanViewFindlyArr = () => {
        viewFindlyArr.value = [];
    }

    // 处理即将抽选的范围及球号
    const handleBallArr = () => {
        redArr = [];
        blueArr = [];
        for (let index = 0; index < Number(ballConfigInfoValue.redMaxValueInput); index++) {
            redArr[index] = index + 1;
        }
        for (let index = 0; index < Number(ballConfigInfoValue.blueMaxValueInput); index++) {
            blueArr[index] = index + 1;
        }
        redArr = _.shuffle(redArr);
        blueArr = _.shuffle(blueArr);
    }
    // 开始旋转
    const startShuffle = () => {
        // 开始洗球
        isShuffleFlag.value = true;

        if (selectedNumberArr.length === 0 || (
            selectedNumberArr.length >= (
                Number((Number(ballConfigInfoValue.redSeveralInput) + Number(ballConfigInfoValue.blueSeveralInput)).toFixed(1))
            )
        )) {
            // 上一轮的抽选结束 或 才刚开始抽选，都把已选的球容器清空
            selectedNumberArr = [];
            handleBallArr();
            curShuffleArr.value = [...redArr];
            selectBlueFlag.value = false;
        } else if (selectedNumberArr.length === Number(ballConfigInfoValue.redSeveralInput)) {
            // 红球抽选完毕，"刚开始"抽篮球时
            handleBallArr();
            curShuffleArr.value = [...blueArr];
            selectBlueFlag.value = true;
        } else {
            curShuffleArr.value.splice(curShuffleIndex.value!, 1);
        }
        curShuffleIndex.value = null;

        // 其它情况还继续使用curShuffleArr容器现有的球，不做处理
        curShuffleArr.value = _.shuffle(curShuffleArr.value);

        // 每间隔一段时间洗一次球
        shuffleBallTime = setInterval(() => {
            curShuffleArr.value = _.shuffle(curShuffleArr.value);
        }, 150);

        // 一定时间后无抽选停止洗球
        stopShuffleBallTime = setTimeout(() => {
            // 停止洗牌
            clearShuffleBallTime();
            // 也把当前的定时器停止
            clearStopShuffleBallTime();
        }, 60000);

    };
    // 停止洗牌，并抽选出球
    const selectBall = () => {
        // 清除定时器
        clearShuffleBallTime();
        clearStopShuffleBallTime();

        // 抽选出球
        let curIndex = 0;
        if (raffleWay.value === "1") {
            // 中间抽取
            curIndex = Math.floor(curShuffleArr.value.length / 2);
        } else if (raffleWay.value === "2") {
            // 随机抽取
            curIndex = Math.floor(Math.random() * curShuffleArr.value.length);
        }
        // 存储当前取出的球索引下标
        curShuffleIndex.value = curIndex;

        selectedNumberArr.push(curShuffleArr.value[curIndex]);
        /* // 去掉选中的，防止重复
        // 为了给用户看到取到那个球，放在开始洗牌前处理
        curShuffleArr.value.splice(curIndex, 1); */

        // 如果抽选的球数大于等于总数，则把当前的结果放入最终结果中
        if (selectedNumberArr.length >= (
            Number(
                (Number(ballConfigInfoValue.redSeveralInput) + Number(ballConfigInfoValue.blueSeveralInput)).toFixed(1)
            )
        )) {
            
            // 对最终结果进行排序
            let selectedNumberArr1 = selectedNumberArr.slice(0, ballConfigInfoValue.redSeveralInput);
            let selectedNumberArr2 = selectedNumberArr.slice(
                ballConfigInfoValue.redSeveralInput,
                Number((ballConfigInfoValue.redSeveralInput + ballConfigInfoValue.blueSeveralInput).toFixed(1))
            );
            // 对viewFindlyArr1从小到大排序
            selectedNumberArr1.sort((a, b) => {
                return a - b;
            });
            // 对viewFindlyArr2从小到大排序
            selectedNumberArr2.sort((a, b) => {
                return a - b;
            });
            viewFindlyArr.value.unshift([...selectedNumberArr1, ...selectedNumberArr2]);
        }

        // 停止洗球
        isShuffleFlag.value = false;
    };

    // 快速抽选
    const quickExtraction = () => {
        handleBallArr();
        selectedNumberArr = [];

        let tempShuffleArr = [...redArr];
        let tempRedArr = [];
        for (let index = 0; index < ballConfigInfoValue.redSeveralInput; index++) {

            let messyedRedArray = _.shuffle(tempShuffleArr);
            // 抽选出球
            let curIndex = 0;
            if (raffleWay.value === "1") {
                // 中间抽取
                curIndex = Math.floor(messyedRedArray.length / 2);
            } else if (raffleWay.value === "2") {
                // 随机抽取
                curIndex = Math.floor(Math.random() * messyedRedArray.length);
            }
            selectedNumberArr.push(messyedRedArray[curIndex]);
            tempRedArr.push(messyedRedArray[curIndex]);

            // 去掉选中的，防止重复
            messyedRedArray.splice(curIndex, 1);
            tempShuffleArr = messyedRedArray;
        }
        tempRedArr = tempRedArr.sort((a, b) => {
            return a - b;
        });

        // 取蓝球
        tempShuffleArr = [...blueArr];
        let tempBlueArr = [];
        for (let index = 0; index < ballConfigInfoValue.blueSeveralInput; index++) {

            let messyedBlueArray = _.shuffle(tempShuffleArr);
            // 抽选出球
            let curIndex = 0;
            if (raffleWay.value === "1") {
                // 中间抽取
                curIndex = Math.floor(messyedBlueArray.length / 2);
            } else if (raffleWay.value === "2") {
                // 随机抽取
                curIndex = Math.floor(Math.random() * messyedBlueArray.length);
            }
            selectedNumberArr.push(messyedBlueArray[curIndex]);
            tempBlueArr.push(messyedBlueArray[curIndex]);

            // 去掉选中的，防止重复
            messyedBlueArray.splice(curIndex, 1);
            tempShuffleArr = messyedBlueArray;
        }
        tempBlueArr = tempBlueArr.sort((a, b) => {
            return a - b;
        });

        viewFindlyArr.value.unshift([...tempRedArr, ...tempBlueArr]);
    }

</script>
  
<style scoped>
    .raffle-view {
        padding: 20px;
    }
    .config-item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 10px;
    }
    .config-label {
        flex: 1;
        text-align: end;
    }
    .config-input {
        flex: 1;
    }
    .input {
        width: 100px;
    }

    .content-mt_MYG2H {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .circleall_1lvti {
        width: 30px;
        height: 30px;
        margin-right: 8px;
        margin-bottom: 8px;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .number_2xOZd {
        color: #fff;
        font-size: 16px;
        line-height: 16px;
        font-weight: 700;
    }
    .red_ball {
        background-size: contain;
        background-repeat: no-repeat;
        background-image: linear-gradient(180deg, #FE8A5C 0%, #FF4D4D 100%);
    }
    .blue_ball {
        background-size: contain;
        background-repeat: no-repeat;
        background-image: linear-gradient(180deg, #31CAF5 0%, #198CFF 100%);
    }
    .yellow_ball.yellow_ball {
        background-size: contain;
        background-repeat: no-repeat;
        background-image: linear-gradient(180deg, #31f53b 0%, #19ff3f 100%);
    }
</style>
  