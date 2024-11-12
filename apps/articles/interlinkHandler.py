
import math

class TextMatch:
	def	__init__(self,text,text_arr):
		self.text=text.lower()
		self.text_arr=[ text.lower() for text  in text_arr ]
		self.dataDict={ chr(i):i for i in range(97,123) }
		for i in range(10):
			self.dataDict[str(i)]=(123+i)
		self.dataDict[":"]=133
		self.matchDict={}
		self.distStore=[]
		self.keywords=text.lower().split(" ")

	def textToFloat(self,Text):
		textData=[]
		for word in Text.split(" "):
			if word in self.keywords:
				textData.append(self.wordtoFloat(word)-0.1)
			else:
				textData.append(self.wordtoFloat(word))
		for _ in range(abs(len(Text)-len(self.text))):
			textData.append(0)
		return textData
			
	def wordtoFloat(self,Word):
		wordVal=0
		for alphabet in Word:
			wordVal+=self.dataDict[alphabet]
		return 1/wordVal if wordVal > 0 else 0
	
	def euclidDist(self,vec1,vec2):
		total=0
		for x,y in zip(vec1,vec2):
			total+=(x-y)**2
		self.distStore.append(math.sqrt(total))
		return math.sqrt(total)
	
	def getMatch(self,tmpText):
		floatvmText=self.textToFloat(self.text)
		floatvtmpText=self.textToFloat(tmpText)
		self.matchDict[str(self.euclidDist(floatvmText,floatvtmpText))]=tmpText
		
	def getMatches(self):
			for text in self.text_arr:
				self.getMatch(text)
			self.distStore.sort()
			return [ self.matchDict[str(i)] for i in self.distStore ]
			
	
