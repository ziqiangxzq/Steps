<template>
	<view class="content">

		<view :class="!isStart?'button_box':'button_box button_act'">
		<view :class="!isStart?'button_bg_2':'button_bg_2 button_act'"></view>
		<view :class="!isStart?'button_bg_3':'button_bg_3 button_act'"></view>
		<view class="button_content" v-if="!isStart" @click="playCard(1)">签入</view>
		<view class="button_content" v-else @click="playCard(0)">签出</view>
		</view>
		<view class='unit_box'>
			<view :class='index==actNum?"unit unitAct":"unit"'  @click="changeAct(index)" v-for="(item,index) in unitArr">{{item.tab}}</view>
		</view>
		<view class='content_box'>
			<view class="title_box">
				<view class='cir'></view>
				<view class='title'>{{unitArr[actNum].name}}</view>
				<view v-if="actNum==3"  class="upload" @click="addMsg()">添加</view>
				<view class="input_box" ref="input"></view>
				<!-- <input id="input" type="file" @change='imageChange' /> -->
			</view>
			<view class="trend">
				<!-- 趋势star -->
				<view class="trent_unit_box" v-if="actNum==0&&cardList.length!=0" v-for="(item,index) in dateArr">
					<view class="trent_text">{{item.date}}</view>
					<view class="trend_line">
						<view class="trend_real_line" :style='`width:${(item.minutes/(Math.max(...dateArr.map(e=>e.minutes)).toFixed(1)))*100}%`'></view>
					</view>
					<view class="trent_text" v-if="item.minutes>=60">{{(item.minutes/60).toFixed(1)}}h</view>
					<view class="trent_text" v-else>{{item.minutes}}m</view>
				</view>
				<!-- 记录详情 -->
				
				<view class="text_bg" v-if="actNum==1&&cardList.length!=0">
					<view class="card_box"  v-if="item.minutes!=0"  v-for="item in dateArr">
					<view class="card_data">
						{{item.date}}
					</view>
					<view class="card_time" v-if="item.minutes>=60">
						{{(item.minutes/60).toFixed(1)}}h
					</view>
					<view class="card_time" v-else>
						{{item.minutes}}min
					</view>
					<view class="card_list" v-for="itam in item.list" >
						<view>{{itam.startTime.slice(5,itam.startTime.length-3)}}</view>
						<view>{{itam.endTime.slice(5,itam.endTime.length-3)}}</view>
						<view class="time_text" v-if="itam.minute<60">{{itam.minute}}m</view>
						<view class="time_text" v-else>{{(item.minutes/60).toFixed(1)}}h</view>
					</view>
				</view>
				</view>
				<view class="no_content" v-if="cardList.length==0&&(actNum==0||actNum==1)">
					暂无打卡数据
				</view>
				
				<!-- 图片文件 -->
				<view class="no_content" v-if="actNum==2">
					暂无图片文档
				</view>
				<!-- 	<view class="card_box" v-if="actNum==2" v-for="item in 3">
						<view class="card_data">
							08-07
						</view>
						<view class="image_list">
							<view class="image_box" v-for="item in 10">
								<image src="../../static/logo.png">
							</view>
						</view>
					</view> -->
					<view class="text_bg"  v-if="actNum==3">
						<view class="text_box" v-for="item in msgList">
						<view class="text_content">
							{{item.msg}}
						</view>
						<!-- <view class="tab_box">测试标签</view> -->
						<view class="text_data">
							{{item.time}}
						</view>
					</view>
					</view>
					
				
			</view>
		</view>
		<view class="addMsg_box" v-if="showAddMsg">
			<view class="addmsg_dialog">
			<view class="textarea_box">
				<textarea name="" id="" v-model="msgText" placeholder="请输入" cols="30" rows="10"></textarea>
			</view>
			<view class="msg_button_box">
				<view class="button bg_gray" @click="()=>{showAddMsg=false}">取消</view>
				<view class="button" @click="submitMsg">确认</view>
			</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		request
	} from "../request"
	import moment from "moment"; 
	export default {
		data() {
			return {
				endId:null,
				isStart:false,
				actNum:0,
				title: 'Hello',
				unitArr:[{tab:'统',name:'统计信息'},
				{tab:'卡',name:'打卡记录'},
				{tab:'图',name:'图片文档'},
				{tab:'记',name:'记事本'}],
				dateArr:[],//打卡记录
				cardList:[],
				msgList:[],
				showAddMsg:false,
				msgText:'',
				trendArr:[
					{data:'01',hour:1},
					{data:'02',hour:2},
					{data:'03',hour:0.8},
					{data:'04',hour:0.5},
					{data:'05',hour:1},
					{data:'06',hour:2},
					{data:'07',hour:1.5}
				]
			}
		},
		onLoad() {
             this.getCardList()
			 // this.getMessageList()
		},
		watch:{
		actNum(nv){
			if(nv===3){
				 this.getMessageList()
			}
		}	
		},
		methods: {
		  addMsg(){
				this.showAddMsg=true
			},
          changeAct(actNum){
			  this.actNum=actNum
		  },
		  playCard(isStart){//isStart-1开始 isStart-0结束
		  
		  if(isStart==1){
			  let startTime=moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
			  let date=moment(new Date()).format('MM-DD')
				  request("http://123.60.136.204:8082/cardlist?endTime='"+startTime+"'&startTime='"+startTime+"'&date='"+date+"'&user=0",'PUT',{}).then(resdata=>{
                  if(resdata.data.data.isSuccess){
                  	this.isStart=true;
                  	this.getCardList()
                  }
				  })   
		  }else{
			  let endTime=moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
			  				  request("http://123.60.136.204:8082/cardlist?endTime='"+endTime+"'&id="+this.endId,'PUT',{}).then(resdata=>{
								  if(resdata.data.data.isSuccess){
									this.isStart=false;
									this.getCardList()
								  }
			      })
			  
		  }
		
		  },
		  getMessageList(){
			  request('http://123.60.136.204:8082/messagelist?page=1&pagesize=100&user=0','POST',{}).then(res=>{
				  console.log(res)
				  let data=res.data.data.data
				  data.forEach(item=>{
					  item.time=moment(item.time).format('YYYY-MM-DD HH:mm:ss')
				  })
				  this.msgList=data
			  })
		  },
		  
		  submitMsg(){
			if(this.msgText!=''){
				let time=moment().format('YYYY-MM-DD HH:mm:ss')
				  request('http://123.60.136.204:8082/messagelist?msg="'+this.msgText+'"&time="'+time+'"&user=0','PUT',{}).then(res=>{
		  				  console.log(res)
						  if(res.data.data.isSuccess==true){
							  this.showAddMsg=false
							  this.msgText=''
							  this.getMessageList()
						  }
		  				  // let data=res.data.data.data
		  				  // this.msgList=data
		  			  })
			}
		  			
		  },
		  getCardList(){
			  let params={}
			  request('http://123.60.136.204:8082/cardlist?page=1&pagesize=100&user=0','POST',params).then(resdata=>{
			  			let cardlist=resdata.data.data.data;
						this.cardList=resdata.data.data.data;
						let dateArr=[];
						if(cardlist.length!=0&&cardlist[0].startTime==cardlist[0].endTime){
							this.isStart=true;
							this.endId=cardlist[0].id
						}
						for(let i=0;i<7;i++){
												dateArr.push({
													date:moment().subtract(i,'days').format('MM-DD'),
													list:[],
													minutes:0
												})
											}
						if(cardlist.length!=0){
							cardlist.forEach(item=>{
							let starTime=moment(new Date(item.startTime));
							let endTime=moment(new Date(item.endTime));
							let minute=endTime.diff(starTime,"minutes")
							item.startTime=starTime.format("YYYY-MM-DD HH:mm:ss");
							item.endTime=endTime.format("YYYY-MM-DD HH:mm:ss");
							item.minute= minute//(minute/60).toFixed(2)
							dateArr.forEach(itam=>{
								if(itam.date==item.date){
									itam.list.push(item)
								}
							})
						})	
						}
				
						dateArr.forEach(item=>{
							if(item.list.length>0){
								
							item.list.forEach(itam=>{
								item.minutes=item.minutes+itam.minute
							})	
							}
						})
						this.dateArr=dateArr
						console.log(dateArr)
						console.log('hours',cardlist)
			  })
		  }
		,
		uploadImg(){
			 var input=document.createElement('input');
			 input.type='file';
			 input.accept='image/*';
			 this.$refs.input.$el.appendChild(input)
			 input.onchange=(event)=>{
				 console.log('event',event)
           let form=new FormData()
		   // setTimeout(()=>{
			   var data=event.srcElement.files[0];
			   form.append('testfile1', data)
			       let xhr = new XMLHttpRequest();
			    xhr.open('POST','http://123.60.136.204:8082/upload');
			           //xhr.open('POST', 'http://123.60.136.204:8020/person?page=1&pagesize=10');
			          
			           xhr.send(form||'');
			           xhr.onreadystatechange = function () {
			             if (xhr.readyState == 4 && xhr.status == 200) {
			               let data = JSON.parse(xhr.responseText).data;
			   
			               console.log('1111111111111111111111a’')
			               // _this.perArr = data.data;
			               // console.log('11', data.subnum)
			               // _this.dataSub = data.subnum;
			             } else {
			               console.log('11')
			             }
			           };
			   // request('http://123.60.136.204:8020/upload','POST',form).then(res => {
			   // console.log(res)
			   // })
		   // },1000)
			 }
			 
			input.click()
			      // let form=new FormData()
			      // form.append('testfile1', data)
			      // this.Ajax('http://192.168.101.3:8020/upload','POST',form).then(res => {
			      // console.log(res)
			      // })
		}},
		
	}
</script>

<style>
	@keyframes scale{
		0%{transform:scale(1);opacity:0.1}
		100%{transform:scale(1.3);opacity:0}
	}
	.content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;

	}
   .button_box{
    position: relative;
    width: 10rem;
    border-radius: 50%;
    height: 10rem;
    background-color: #0090ff;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color:#fff;
	font-size:4em;
	/* padding-bottom: 0.8rem; */
	margin:8rem 0 5rem 0
	/* animation:scale 2s infinite */
	}
	
	
	.button_content{
		position:absolute;
		width:100%;
		height:100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size:1.8rem
	}
	.button_bg_1{
    position: absolute;
    width: 10rem;
    border-radius: 50%;
    height: 10rem;
    background-color: #0090ff;
	animation:scale 3s infinite	alternate	
	}
	.button_bg_2{
	position: absolute;
	width: 13rem;
	border-radius: 50%;
	height: 13rem;
	background-color: #0090ff;
	animation:scale 3s infinite alternate	
	}
	.button_bg_3{
	position: absolute;
	width: 16rem;
	border-radius: 50%;
	height: 16rem;
	background-color: #0090ff;
	animation:scale 3s infinite	alternate	
	}
	
	.unit_box{
		position:relative;
		width:95%;
		margin-left:2.5%;
		height:4rem;
		background-color:#eee;
		border-radius:3rem;
		display:flex;
		align-items: center;
		justify-content: space-evenly;
		
	}
	.unit{
		position:relative;
		width:2.2rem;
		height:2.2rem;
		background-color:#bbb;
		color:#fff;
		border-radius:50%;
		display:flex;
		align-items: center;
		justify-content: center;
	}
	.unitAct{
		background-color: #0090ff;
	}
	.content_box{
		position:relative;
		width:95%;
		flex:1;
		background-color:#eee;
		border-radius:2rem 2rem 0 0;
		margin-top:1.5rem;
		display:flex;
		flex-direction: column;
		overflow: scroll;
	}
	.title_box{
		position: sticky;
		width:calc(100% - 2.4rem);
		top: 0px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding:1.2rem 1.2rem 0.8rem 1.5rem;
		z-index: 999;
		background-color: #eee;
	}
	.cir{
		position: relative;
		width: 1rem;	
		height: 1rem;
		background-color: #0090ff;
		border-radius: 50%;
		margin-right: 0.5rem;
	}
	.trend{
		width: 100%;
		flex: 1;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content:space-evenly;
	}
	.trent_unit_box{
		position: relative;
		width: calc(100% - 2rem);
		height: 1rem;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		padding: 0 1rem;
	}
	.trent_text{
		position: relative;
		width: 3rem;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #444;
	}
	.trend_line{
		position: relative;
		flex: 1;
		height: 1rem;
		border-radius:1rem;
		margin: 0 0.5rem;
		background-color: #e5e5e5;
	}
	.trend_real_line{
		position: absolute;
		height: 1rem;
		border-radius:1rem;
		background-color: #0090ff;
	}
	.card_box{
		position: relative;
		width: calc(100% - 2rem);
		/* margin-left:1rem; */
		/* min-height: 4rem; */
		border-radius: 0.5rem;
		background-color: #fff;
		padding-top: 3rem;
		padding-bottom: 1rem;
		overflow: hidden;
		margin-bottom: 1rem;
	}
	.card_data{
		position: absolute;
		left: 1rem;
		top: 1rem;
		color: #0090ff;
		font-size: 1.1rem;
		font-weight: bold;
	}
	.card_time{
		position: absolute;
		right: 1rem;
		top: 1rem;
		color: #0090ff;
		font-size: 1.1rem;
		font-weight: 300;
	}
	.card_list{
		position: relative;
		width:calc(100% - 2rem);
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content:space-between;
		padding: 0 1rem;
	}
	.image_list{
		position: relative;
		width:calc(100% - 2rem);
		height: 8rem;
		display: flex;
		align-items: center;
		justify-content:space-between;
		margin-left: 1rem;
		overflow:scroll;
	}
	.image_box{
		position: relative;
		width: 5rem;
		height: 5rem;
		background-color:#eee;
		border-radius: 0.5rem;
		margin-right: 0.5rem;		
		flex-wrap: nowrap;
		justify-content: baseline;
		flex-shrink: 0;
	}
	.image_box image{
		position: relative;
		width: 100%;
		height: 100%;
	}
	
	.text_content{
		position: relative;
		width:calc(100% - 2rem);
		padding: 1rem;
		text-align: justify;
	}
	.text_box{
		position: relative;
		width: calc(100% - 2rem);
		/* margin-left:1rem; */
		min-height: 4rem;
		border-radius: 0.5rem;
		background-color: #fff;
		padding-top: 1rem;
		padding-bottom: 2rem;
		overflow: hidden;
		margin-bottom: 1rem;
	}
	.text_data{
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		color: gray;
		font-size: 0.8rem;
	}
	.tab_box{
		position: absolute;
		left: 1rem;
		bottom: 1rem;
		height: 1rem;
		font-size: 0.8rem;
		border:1px solid #0090ff;
		color: #0090ff;
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.1rem 0.5rem;
	}
	.button_act{
		background-color: #ffb301;
	}
	.time_text{
		width: 2rem;
		text-align: right;
		
	}
	.upload{
		position: absolute;
        right: 1.8rem;
        color: #0090ff;
	}
	.input_box{
		visibility: hidden;
	}
	.no_content{
		color:gray
	}
	.text_bg{
		position: relative;
		
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}
	.addMsg_box{
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #00000044;
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.addmsg_dialog{
		position: relative;
		width: calc(100% - 4rem);
		height:18rem;
		background-color: #fff;
		border-radius: 1rem;
		margin-bottom: 10rem;
		padding: 1rem;
		display: flex;
	    flex-direction:column
	}
	.textarea_box{
		position: relative;
		width: 100%;
		flex: 1;
	}
	.msg_button_box{
		position: relative;
		width: 100%;
		height: 3rem;
		/* background-color: #ffb301; */
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.textarea_box textarea{
		width: calc(100% - 2rem);
		height: 80%;
		padding:1rem;
		border: 1px solid #e5e5e5;
	}
	.button{
		position: relative;
		width: 5rem;
		height: 2.8rem;
		color: #fff;
		background-color: #0090ff;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.5rem;
	}
	.bg_gray{
		background-color:#aaa;
	}
	</style>
