/* === Chat panel + Right sidebar (Chat / History / Comments) === */

function ChatTab({ project, onSendCommand, isGenerating, generationMode, setGenerationMode }) {
  const [input, setInput] = React.useState('');
  const [attachments, setAttachments] = React.useState([]);
  const bodyRef = React.useRef(null);
  const taRef = React.useRef(null);

  const handlePaste = async (e) => {
    const { images } = readClipboard(e);
    if (images.length) {
      e.preventDefault();
      for (const im of images) {
        const src = await fileToDataUrl(im.file);
        setAttachments(a => [...a, { id: uid(), kind: 'image', src, name: im.name }]);
      }
    }
  };

  const messages = project?._chatMessages || project?.history?.map(h => ({
    role: 'user', text: h.cmd, ts: h.ts, summary: h.summary,
  })) || [];

  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages.length, isGenerating]);

  const send = () => {
    const t = input.trim();
    if ((!t && attachments.length === 0) || isGenerating) return;
    setInput('');
    const atts = attachments;
    setAttachments([]);
    onSendCommand(t, atts);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <div className="chat-body" ref={bodyRef}>
        {messages.length === 0 && (
          <div className="chat-msg ai">
            <div className="avatar">AI</div>
            <div className="bubble">
              <div>안녕하세요. 어떤 게임 기획서를 만들어 드릴까요?</div>
              <div className="meta">샘플: PDF 18종 분석 완료 · 슈퍼범퍼즈 스타일 학습</div>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div className={'chat-msg ' + (m.role || 'user')} key={i}>
            <div className="avatar">{m.role === 'ai' ? 'AI' : (project?.author || '나').slice(0, 2)}</div>
            <div className="bubble">
              {m.role === 'ai' && m.actions && (
                <div style={{ marginBottom: 6 }}>
                  {m.actions.map((a, ai) => <span key={ai} className="action-chip">{a}</span>)}
                </div>
              )}
              <div>{m.text}</div>
              {m.summary && <div className="meta">{m.summary}</div>}
              {m.ts && <div className="meta">{m.ts}</div>}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="chat-msg ai">
            <div className="avatar">AI</div>
            <div className="bubble">
              <div className="chat-typing">
                <span>{generationMode === 'ai' ? '슬라이드 구조 생성 중' : '템플릿 채우는 중'}</span>
                <span className="dots"><span></span><span></span><span></span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="chat-suggestions">
          <div className="label">빠른 시작</div>
          {CHIP_SUGGESTIONS.map((s, i) => (
            <button key={i} className="chip" onClick={() => onSendCommand(s)}>{s}</button>
          ))}
        </div>
      )}

      <div className="chat-input">
        {attachments.length > 0 && (
          <div className="chat-attach-row">
            {attachments.map(a => (
              <div className="chat-attach-chip" key={a.id}>
                <div className="thumb">
                  {a.kind === 'image' ? <img src={a.src} alt="" /> : 'TXT'}
                </div>
                <span>{a.name.slice(0, 18)}</span>
                <button onClick={() => setAttachments(at => at.filter(x => x.id !== a.id))}>✕</button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <button
            className={'chip ' + (generationMode === 'ai' ? 'active' : '')}
            style={generationMode === 'ai' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : null}
            onClick={() => setGenerationMode('ai')}
          >
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>AI</span> Gemini 생성
          </button>
          <button
            className={'chip ' + (generationMode === 'demo' ? 'active' : '')}
            style={generationMode === 'demo' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : null}
            onClick={() => setGenerationMode('demo')}
          >
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>FAST</span> 데모
          </button>
        </div>
        <div className="wrap">
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            onPaste={handlePaste}
            placeholder="기획서 수정 명령 또는 ⌘V로 이미지 첨부…  (Enter 전송)"
            rows={2}
            disabled={isGenerating}
          />
          <button className="send" onClick={send} disabled={(!input.trim() && attachments.length === 0) || isGenerating}>
            전송 <span style={{ opacity: 0.8 }}>↵</span>
          </button>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
          예: "사망 FLOW 슬라이드 추가" / 이미지 붙여넣기 + "이 디자인 참고해서 화면 설계 슬라이드"
        </div>
      </div>
    </>
  );
}

function HistoryTab({ project, onRollback }) {
  const items = project?.history || [];
  if (items.length === 0) {
    return <div className="chat-body" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)', fontSize: 12 }}>아직 명령 기록이 없습니다.</div>;
  }
  return (
    <div className="chat-body">
      {items.slice().reverse().map((h, i) => (
        <div className="history-item" key={i}>
          <div className="ts">{h.ts}</div>
          <div className="cmd">"{h.cmd}"</div>
          <div className="res">→ {h.summary}</div>
          <div className="actions">
            <button onClick={() => onRollback && onRollback(items.length - 1 - i)}>롤백</button>
            <button>차이 보기</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentsTab({ project, onAddComment }) {
  const [text, setText] = React.useState('');
  const comments = project?.comments || [];

  return (
    <>
      <div className="chat-body">
        {comments.length === 0 && (
          <div style={{ color: 'var(--text-4)', fontSize: 12, textAlign: 'center', marginTop: 24 }}>
            댓글이 없습니다.
          </div>
        )}
        {comments.map((c, i) => (
          <div className="comment" key={i}>
            <div className="head">
              <span className="who">{c.who}</span>
              <span className="at">{c.at}</span>
            </div>
            <div className="body">{c.body}</div>
            {c.ref && <div className="ref">→ {c.ref}</div>}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <div className="wrap">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="댓글 추가… (Shift+Enter 줄바꿈)"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (text.trim()) {
                  onAddComment({
                    who: project?.author || '나',
                    at: new Date().toISOString().slice(0, 16).replace('T', ' '),
                    body: text.trim(),
                    ref: '',
                  });
                  setText('');
                }
              }
            }}
          />
          <button className="send" disabled={!text.trim()} onClick={() => {
            if (!text.trim()) return;
            onAddComment({
              who: project?.author || '나',
              at: new Date().toISOString().slice(0, 16).replace('T', ' '),
              body: text.trim(),
              ref: '',
            });
            setText('');
          }}>추가</button>
        </div>
      </div>
    </>
  );
}

function RightPanel(props) {
  const [tab, setTab] = React.useState('chat');
  const isConcept = props.isConcept;
  React.useEffect(() => {
    // If on concept and current tab is comments, switch back to chat
    if (isConcept && tab === 'comments') setTab('chat');
  }, [isConcept, tab]);
  return (
    <div className="chat">
      <div className="chat-tabs">
        <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>AI 채팅</button>
        <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>
          명령 히스토리
          {props.project?.history?.length > 0 && (
            <span style={{ marginLeft: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)' }}>
              ({props.project.history.length})
            </span>
          )}
        </button>
        {!isConcept && (
          <button className={tab === 'comments' ? 'active' : ''} onClick={() => setTab('comments')}>
            댓글
            {props.project?.comments?.length > 0 && (
              <span style={{ marginLeft: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)' }}>
                ({props.project.comments.length})
              </span>
            )}
          </button>
        )}
      </div>
      {tab === 'chat' && <ChatTab {...props} />}
      {tab === 'history' && <HistoryTab {...props} />}
      {tab === 'comments' && !isConcept && <CommentsTab {...props} />}
    </div>
  );
}

Object.assign(window, { RightPanel });
