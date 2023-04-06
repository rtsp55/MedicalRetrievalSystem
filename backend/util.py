import os
from string import punctuation

import nltk
from nltk import word_tokenize
from nltk.corpus import stopwords
from nltk.stem.snowball import SnowballStemmer

root = os.path.dirname(os.path.abspath(__file__))
download_dir = os.path.join(root, 'nltk_data')
os.chdir(download_dir)
nltk.data.path.append(download_dir)

stemmer = SnowballStemmer('english')
stop_words = stopwords.words('english')

punctuation = list(punctuation)


class IdMap:
   

    def __init__(self):
        
        self.str_to_id = {}
        self.id_to_str = []

    def __len__(self):
        
        return len(self.id_to_str)

    def __get_str(self, i):
        
        return self.id_to_str[i]

    def __get_id(self, s):
        
        if s in self.str_to_id:
            return self.str_to_id[s]

        new_id = len(self.id_to_str)

        self.str_to_id[s] = new_id
        self.id_to_str.append(s)

        return new_id

    def __getitem__(self, key):
        
        if type(key) is int:
            return self.__get_str(key)
        elif type(key) is str:
            return self.__get_id(key)
        else:
            raise TypeError


def preprocess_text(text):
    
    tokenized_text = word_tokenize(text)
    stemmed_text = [stemmer.stem(word) for word in tokenized_text]
    stopword_removed_text = [
        word for word in stemmed_text if word not in stop_words and word not in punctuation]

    return stopword_removed_text
