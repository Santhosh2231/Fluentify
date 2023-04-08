
from controllers.Correction import Correction

def grammar_correction_routes(api):
    api.add_resource(Correction,"/api/correction");

