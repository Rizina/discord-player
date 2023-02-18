import { GuildQueue } from './GuildQueue';

export interface GuildQueueStatisticsMetadata {
    latency: {
        eventLoop: number;
        voiceConnection: number;
    };
    status: {
        buffering: boolean;
        playing: boolean;
        paused: boolean;
        idle: boolean;
    };
    tracksCount: number;
    historySize: number;
    extractors: number;
    listeners: number;
    memoryUsage: NodeJS.MemoryUsage;
    versions: {
        node: string;
        player: string;
    };
}

export class GuildQueueStatistics<Meta = unknown> {
    public constructor(public queue: GuildQueue<Meta>) {}

    public generate() {
        return {
            latency: {
                eventLoop: this.queue.player.eventLoopLag,
                voiceConnection: this.queue.ping
            },
            status: {
                buffering: this.queue.node.isBuffering(),
                playing: this.queue.node.isPlaying(),
                paused: this.queue.node.isPaused(),
                idle: this.queue.node.isIdle()
            },
            tracksCount: this.queue.tracks.size,
            historySize: this.queue.history.tracks.size,
            extractors: this.queue.player.extractors.size,
            listeners: this.queue.guild.members.me?.voice.channel?.members.filter((m) => !m.user.bot).size || 0,
            memoryUsage: process.memoryUsage(),
            versions: {
                node: process.version,
                player: '[VI]{{inject}}[/VI]'
            }
        } as GuildQueueStatisticsMetadata;
    }
}
