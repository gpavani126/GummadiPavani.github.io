from django.shortcuts import render,redirect
import operator
from django.contrib import messages


def homepage(request):
    return render(request,'home.html')

def count(request):
    if request.POST:
        if request.POST['fulltext']=="":
            messages.error(request,"Lütfen bir metin giriniz")
            return redirect('home')
        else:
            fulltext=request.POST['fulltext']
            wordlist=fulltext.split()

            word_dictionary={}


            for word in wordlist:
                if word in word_dictionary:
                    word_dictionary[word] += 1
                else:
                    word_dictionary[word]=1

            #Kelimeler sıralama
            sortedwords=sorted(word_dictionary.items(),key=operator.itemgetter(1),reverse=True)

            # En çok kullanılan kelimeler
            maxwords = {}
            maxwords[sortedwords[0][0]]=sortedwords[0][1]
            for index,word in enumerate(sortedwords):
                if index==0:
                    pass
                else:
                    if list(maxwords.values())[0]==word[1]:
                        maxwords[word[0]]=word[1]

            context={
                'fulltext':fulltext,
                'count':len(wordlist),
                'sortedwords':sortedwords,
                 'maxwords':maxwords
            }
            return render(request,'count.html',context)
    else:
        return redirect('home')
