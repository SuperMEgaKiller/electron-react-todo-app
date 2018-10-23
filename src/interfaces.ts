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


export interface ITasksListState {
    items: ITasks
}

export interface ITasksListProps {
    tasks: ITasks,
    onClick: (event: React.MouseEvent<HTMLElement>, index: number) => void
}

export interface IInputState{

}

export interface IInputProps{
    val: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}