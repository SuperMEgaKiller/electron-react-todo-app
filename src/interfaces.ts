export interface IAppProps {}

export interface ITask{
    task: string,
    date: Date,
    done: boolean
}


export interface IAppState{
    item: ITask,
    items: ITasks,
}

export interface ITasks extends Array<ITask> {}

