class Gramformer:
  def __init__(self, models=1, use_gpu=False):
    from transformers import T5Tokenizer, T5ForConditionalGeneration
    import errant
    self.annotator = errant.load('en')
    
    if use_gpu:
        device= "cuda:0"
    else:
        device = "cpu"
    batch_size = 1    
    self.device    = device
  
    self.model_loaded = False

    if models == 1:
        # Load the T5 tokenizer and model
        self.correction_tokenizer = T5Tokenizer.from_pretrained('C:\\Users\\santh\\Downloads\\t5_gec_model\\t5_gec_model')
        self.correction_model = T5ForConditionalGeneration.from_pretrained('C:\\Users\\santh\\Downloads\\t5_gec_model\\t5_gec_model')
        self.correction_model     = self.correction_model.to(device)
        self.model_loaded = True
        print("[Fluentify] Grammar error correct/Edits loaded..")

  def correct(self, input_sentence, max_candidates=1):
      if self.model_loaded:
        correction_prefix = "gec: "
        input_sentence = correction_prefix + input_sentence
        input_ids = self.correction_tokenizer.encode(input_sentence, return_tensors='pt')
        input_ids = input_ids.to(self.device)

        preds = self.correction_model.generate(
            input_ids,
            do_sample=True, 
            max_length=128, 
#             top_k=50, 
#             top_p=0.95, 
            num_beams=7,
            early_stopping=True,
            num_return_sequences=max_candidates)

        corrected = set()
        for pred in preds:  
          corrected.add(self.correction_tokenizer.decode(pred, skip_special_tokens=True).strip())
        return corrected
      else:
        print("Model is not loaded")  
        return None


  def _get_edits(self, orig, cor):
        orig = self.annotator.parse(orig)
        cor = self.annotator.parse(cor)
        alignment = self.annotator.align(orig, cor)
        edits = self.annotator.merge(alignment)

        if len(edits) == 0:  
            return []

        edit_annotations = []
        for e in edits:
            e = self.annotator.classify(e)
            edit_annotations.append((e.type[2:], e.o_str, e.o_start, e.o_end,  e.c_str, e.c_start, e.c_end))
                
        if len(edit_annotations) > 0:
            return edit_annotations
        else:    
            return []

  def get_edits(self, orig, cor):
      return self._get_edits(orig, cor)