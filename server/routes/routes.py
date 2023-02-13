
from controllers.gramformer import Gramformer


def grammar_correction_routes(api):
    api.add_resource(Gramformer,"/api/grammarcorrection")

