export interface UseCase<Input, Output> {
  run(input: Input): Output
}
