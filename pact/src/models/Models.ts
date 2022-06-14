import { Model } from "../../../src/models/ClinicalReview/Model";
import AbstractClient from './AbstractClient';

export default class Models {
    private model: Model;

    constructor(model: Model) {
        this.model = model
    }

    public getModel(): Model {
        return this.model
    }
}

export class ModelClient extends AbstractClient {
    private url = '/models'

    public fetchModels() {
        return this.axios.get(this.url, { headers: { Authorization: "token" } }).then(
            res => {
                const data: Array<Model> = res.data
                return data.map((model: Model) => {
                    return new Models({
                        model_name: model.model_name,
                        model_version: model.model_version,
                        active: model.active,
                        mode: model.mode,
                        predicate: model.predicate,
                        stats: model.stats
                    }).getModel()
                })
            },
            err => {
                throw new Error(`Error response ${err.body}`)
            }
        )
    }

    public fetchModelsNoneExist() {
        return this.axios.get(this.url, { headers: { Authorization: "token" } })
    }

    public fetchModelsNoAuth() {
        return this.axios.get(this.url)
    }
}
