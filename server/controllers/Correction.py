from gramformer import Gramformer
import torch
from flask_restful import Resource
from flask import request,Response

def set_seed(seed):
  torch.manual_seed(seed)
  if torch.cuda.is_available():
    torch.cuda.manual_seed_all(seed)

set_seed(1212)


gf = Gramformer(models = 1, use_gpu=False) # 1=corrector, 2=detector

class Correction(Resource):
    def post(self):
        body = request.get_json()
        text = body["text"]
        influent_sentences = text.split(".")
        for influent_sentence in influent_sentences:
            corrected_sentences = gf.correct(influent_sentence, max_candidates=1)
            print("[Input] ", influent_sentence)
            for corrected_sentence in corrected_sentences:
                print("[Correction] ",corrected_sentence)

        return {'val':10}