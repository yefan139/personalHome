<template>
    <div class="playing-cards">
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
        <div class="config-item" v-if="isShuffleFlag">
            <el-button type="primary" @click="stopShuffle">停止洗牌</el-button>
        </div>
        <div class="config-item" v-else>
            <el-button type="primary" link @click="cleanCurSelectArr" v-if="selectedNumberArr.length > 0">清空此轮选择</el-button>
            <el-button type="primary" @click="startShuffle" :disabled="!showCards">开始洗牌</el-button>
            <el-button type="primary" @click="closeCards">{{ showCards ? "关闭选择" : "打开选择"}}</el-button>
        </div>
        <div class="config-item">
            <div class="content-curlist">
                <template v-for="(item, i) in selectedNumberArr" :key="i">
                    <div :class="['circleall_1lvti', i < ballConfigInfoValue.redSeveralInput ? 'red_ball' : 'blue_ball']">
                        <span class="number_2xOZd">
                            {{item}}
                        </span>
                    </div>
                </template>
            </div>
        </div>
        <div class="cards-box" v-if="showCards" v-loading="isShuffleFlag">
            <template v-if="selectBlueFlag">
                <div
                    :class="['card-item', 'blue_ball', curSelectBlueArr.includes(item) ? 'active' : '']"
                    v-for="(item, i) in curShuffleArr"
                    :key="i"
                    @click="() => selectCards(item)"
                >
                    {{curSelectBlueArr.includes(item) ? item : ""}}
                </div>
            </template>
            <template v-else>
                <div
                    :class="['card-item', 'red_ball', curSelectRedArr.includes(item) ? 'active' : '']"
                    v-for="(item, i) in curShuffleArr"
                    :key="i"
                    @click="() => selectCards(item)"
                >
                    {{curSelectRedArr.includes(item) ? item : ""}}
                </div>
            </template>
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
    // 是否显示牌
    const showCards = ref(true);
    // 当前轮次的抽球范围及球号
    const curShuffleArr = ref<ballArrType>([]);
    // 当前轮次抽取的红球
    const curSelectRedArr = ref<ballArrType>([]);
    // 当前轮次抽取的蓝球
    const curSelectBlueArr = ref<ballArrType>([]);
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
    // 切换选择牌
    const closeCards = () => {
        showCards.value = !showCards.value;
    };

    // 清空当前轮次选择的球
    const cleanCurSelectArr = () => {
        curSelectRedArr.value = [];
        curSelectBlueArr.value = [];
        selectedNumberArr = [];
    };
    // 清空结果
    const cleanViewFindlyArr = () => {
        viewFindlyArr.value = [];
    };

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
            curSelectRedArr.value = [];
            curSelectBlueArr.value = [];
            curShuffleArr.value = [...redArr];
            selectBlueFlag.value = false;
        } else if (selectedNumberArr.length === Number(ballConfigInfoValue.redSeveralInput)) {
            // 红球抽选完毕，"刚开始"抽篮球时
            handleBallArr();
            curShuffleArr.value = [...blueArr];
            selectBlueFlag.value = true;
        } else if (selectBlueFlag.value) {
            // 当前抽选蓝球阶段，把已选的蓝球球从容器中去掉
            curShuffleArr.value = curShuffleArr.value.filter((el) => !curSelectBlueArr.value.includes(el));
        } else {
            // 当前抽选红球阶段，把已选的红球球从容器中去掉
            curShuffleArr.value = curShuffleArr.value.filter((el) => !curSelectRedArr.value.includes(el));
        }

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
    // 停止洗牌
    const stopShuffle = () => {
        // 停止洗牌
        clearShuffleBallTime();
        clearStopShuffleBallTime();
        // 停止洗牌
        isShuffleFlag.value = false;
    };
    // 抽选牌
    const selectCards = (el: number) => {
        
        if (isShuffleFlag.value) {
            // 洗牌中，禁止抽牌
            return;
        }
        console.log("el", el);
        if (
            (!selectBlueFlag.value && curSelectRedArr.value.includes(el))
            || (selectBlueFlag.value && curSelectBlueArr.value.includes(el))
        ) {
            // 已选中的不能再点击
            return;
        }
        if (
            (!selectBlueFlag.value && curSelectRedArr.value.length >= Number(ballConfigInfoValue.redSeveralInput))
            || (selectBlueFlag.value && curSelectBlueArr.value.length >= Number(ballConfigInfoValue.blueSeveralInput))
        ) {
            // 数量超了则不能继续选取
            ElMessage({
                message: "当前类型的球已选择完毕！",
                type: "warning",
            })
            return;
        }
        // 选中的球存放到对应的容器中
        if (selectBlueFlag.value) {
            curSelectBlueArr.value.push(el);
        } else {
            curSelectRedArr.value.push(el);
        }
        // 当前轮次抽取的球
        selectedNumberArr.push(el);
        console.log("selectedNumberArr", selectedNumberArr);

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
    };

</script>

<style scoped>
    .playing-cards {
        padding: 32rem;
    }
    .config-item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 10px;
    }
    .cards-box {
        margin-top: 15rem;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10rem;
    }
    .card-item {
        color: #fff;
        height: 130rem;
        font-size: 32rem;
        border: 1px solid #808080;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .content-curlist {
        margin-top: 10px;
        height: 38px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
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
</style>
