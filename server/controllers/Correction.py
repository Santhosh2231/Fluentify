from controllers.gramformer import Gramformer
import torch
from flask_restful import Resource
from flask import request,Response

def set_seed(seed):
  torch.manual_seed(seed)
  if torch.cuda.is_available():
    torch.cuda.manual_seed_all(seed)

set_seed(1212)
gf = Gramformer(models = 1, use_gpu=False)
class Correction(Resource):
    def post(self):
        body = request.get_json()
        print(body)
        text = body["text"]
        output = ""
        edits = []
        influent_sentences = text.split(".")
        for influent_sentence in influent_sentences:
            corrected_sentences = gf.correct(influent_sentence)
            for corrected_sentence in corrected_sentences:
                corrected = corrected_sentence.split(":")
                edit = gf.get_edits(influent_sentence,corrected_sentence)
            output = output+corrected[1]
            edits.append(edit)
        return {'corrected_sentence':output,
                'edits':edits
                }