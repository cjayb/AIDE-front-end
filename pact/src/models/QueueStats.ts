import { QueueMetric } from '../../../src/models/QueueMetric';
import AbstractClient from './AbstractClient';

export default class QueueStats {
    private queueMetric: QueueMetric;

    constructor(queueMetric: QueueMetric) {
        this.queueMetric = queueMetric;
    }

    public getStats(): QueueMetric {
        return this.queueMetric;
    }
}

export class QueueStatsClient extends AbstractClient {
    public fetchStats(queueName: string) {
        let url = "/queues"
        if(queueName !== null) {
            url = `${url}/${queueName}`
        }

        return this.axios.get(url, {headers: {Authorization: "token"}}).then(
            res => {
                    return res.data.map((o: QueueMetric) => {
                        return new QueueStats({
                            name: o.name,
                            delivered: o.delivered,
                            message_count: o.message_count,
                            published: o.published
                        })
                    })
            },
            err => {
                throw new Error(`Error response ${err.body}`)
            }
        )
    }
    
    public fetchQueueDontSerialise(queueName: string) {
        return this.axios.get(`/queues/${queueName}`, {headers: {Authorization: "token"}})
    }

    public fetchQueueNoAuth(queueName: string) {
        return this.axios.get(`/queues/${queueName}`)
    }
}