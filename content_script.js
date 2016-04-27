/**
 * Created by licheng on 16/4/22.
 */
var mybody = document.getElementsByTagName('iframe')[0].contentWindow.document.getElementsByTagName('iframe')[0].contentWindow.document.getElementsByTagName('iframe')[1].contentWindow.document.getElementsByTagName('iframe')[0].contentWindow.document.body
ratioPV(mybody)

function ratioPV(mybody) {
    function hideEle(obj) {
        obj.style.display = 'none'
    }

    hideEle(mybody.getElementsByClassName('pgv2_hot')[0])


    var allModule = {
        touleft: '财经观察', touright: '原子智库', ChannelNav: '导航条',
        HeadNews: '头条', NewsFocus: '要闻', Domestic: '宏观', StockNews: '证券',
        Fortune: '金融', usstock: '美股', hk: '港股', IndustryNews: '公司', tech: '科技',
        Consume: '消费', licaizx: '理财', jijin: '基金', InternationalNews: '国际', kanzhongguo: '看中国',
        lengjing: '棱镜', adfb: '幻灯片', StockInquiry: '自选股', Caijingguancha: '财经观察', Hardchoice: '抉择',
        Freakonomics: '绘客', smartmoney: '资本论', bigData: '大数据', Zhuanti: '热门专题', licai: '理财超市',
        Meeting: '会议活动',

    }
    var modRank = []

    count(allModule, getAllSum(mybody))

    //统计所有模块数据
    function count(obj, sumPv) {

        for (var x in obj) {
            var mod = getSup(x, sumPv)
            modRank.push(mod)
        }

        modRank.sort(
            function(a,b){
                return b.clickNum - a.clickNum
            }

        )
        for(var i = 0 ;i < modRank.length ; i++){
            var textNode = document.createTextNode('  排名：'+(i+1)+'/'+modRank.length)
            //console.log(textNode)
            modRank[i].rankNode.appendChild(textNode)
        }

    }

    //获取指定模块的sum，基于相同链接与点击量的判断去重，完全相等则视为重复
    function getSup(module, sumPV) {
        var modObj

        if (module === 'NewsFocus') {
            var allDivs = mybody.getElementsByTagName('div')
            for (var i = 0; i < allDivs.length; i++) {
                if (allDivs[i].getAttribute('bosszone') === 'NewsFocus1') {
                    modObj = allDivs[i].parentElement.parentElement.parentElement
                    var maskBox = document.createElement('div')
                    maskBox.style.cssText = "position:absolute;top:0;left0;" +
                        "border:3px solid #25dedc;" +
                        "width:100% ;height:100%;background:white;opacity:0.4;z-index:2"
                    //modObj = allDivs[i]
                    modObj.style.position = 'relative'
                    modObj.appendChild(maskBox)
                }
            }
        } else {
            var allDivs = mybody.getElementsByTagName('div')
            for (var i = 0; i < allDivs.length; i++) {
                if (allDivs[i].getAttribute('bosszone') === module) {
                    var maskBox = document.createElement('div')
                    //console.log(maskBox)
                    maskBox.style.cssText = "position:absolute;top:0;left0;" +
                        "border:3px solid #25dedc;" +
                        "width:100% ;height:100%;background:white;opacity:0.4;z-index:2"
                    modObj = allDivs[i]
                    modObj.style.position = 'relative'
                    modObj.appendChild(maskBox)
                }
            }
        }
        var allSups = modObj.getElementsByTagName('sup')

        function _getModSup(obj) {
            var sum = 0
            var hash = {}
            for (var i = 0; i < obj.length; i++) {
                if (!hash[obj[i].textContent]) {
                    hash[obj[i].textContent] = obj[i].previousElementSibling.children[0].href
                } else if (hash[obj[i].textContent] === obj[i].previousElementSibling.children[0].href) {
                    obj[i].textContent = ''
                }
                sum = sum + Number(obj[i].textContent)
            }
            return sum
        }


        var sum = _getModSup(allSups)
        if (typeof  sumPV === "number") {
            var ratio = ((sum / sumPV) * 100).toFixed(2) + "%"
        }

        // console.log("区块点击量:"+sum+"  占比:"+ratio )
        var textBox = document.createElement('div')

        var noteText = document.createTextNode(allModule[module] + "点击量:" + sum + "  占比:" + ratio)
        textBox.appendChild(noteText)
        textBox.style.cssText = "position:absolute; margin:auto;" +
            "width:50% ; height:50%;" +
            "top:0;right:0;bottom:0;left:0;" +
            "font-size:20px;font-weight:bolder;color:black;opacity:1;z-index:2;line-height:1.3;"

        modObj.appendChild(textBox)
        return {clickNum:sum , rankNode:textBox}
    }

    //获取页面总PV，基于bosszone的去重
    function getAllSum(dom) {
        var modsSumPv = 0, allDivs = dom.getElementsByTagName('div') , mods = []

        //获取所有bosszone 区域
        for(var i = 0; i<allDivs.length ; i++){
            if(allDivs[i].getAttribute('bosszone')){
                mods.push(allDivs[i])
            }
        }

        function getModSup(obj) {
            var sum = 0, hash = {}, temp = 0
            for (var i = 0; i < obj.length; i++) {

                if (!hash[obj[i].textContent]) {
                    hash[obj[i].textContent] = obj[i].previousElementSibling.children[0].href
                    temp = Number( obj[i].textContent)
                } else if (hash[obj[i].textContent] === obj[i].previousElementSibling.children[0].href) {
                    temp = 0
                } else {
                    temp = Number(obj[i].textContent)
                    console.log(temp)
                }
                sum = sum + temp
            }
            return sum
        }

        for (var i = 0; i < mods.length; i++) {
            modsSumPv = modsSumPv + getModSup(mods[i].getElementsByTagName('sup'))
        }
        return modsSumPv
    }
}






