/**
 * typing-test-card/typed-character-list.tsx
 *
 * The sequence of character spans in the typing test window. Maps each target
 * character to a dedicated `TypedCharacter` element.
 */
import TypedCharacter from "./typed-character";

export interface TypedCharacterListProps {
  target: string;
  typed: string;
  isFinished: boolean;
}

export default function TypedCharacterList({
  target,
  typed,
  isFinished,
}: TypedCharacterListProps): React.ReactNode {
  return target.split("").map((ch, i) => (
    <TypedCharacter
      key={i}
      ch={ch}
      typedCh={typed.at(i)}
      isTyped={i < typed.length}
      isCurrent={i === typed.length && !isFinished}
    />
  ));
}
