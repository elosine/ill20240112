\version "2.20.0"
%All notation in one line
%Make sure whatever last note has an extra note for full duration
%Resize in Inkscape to 50px per beat
%zoom 210%


\paper
{
  paper-width = 2150 %50px per beat +1 for last beat marking border
  paper-height = 100

  top-margin = 0
  bottom-margin = 0
  left-margin = 0
  right-margin = 0
  
  system-system-spacing =
  #'((basic-distance . 15)  %this controls space between lines default = 12
      (minimum-distance . 8)
      (padding . 1)
      (stretchability . 60)) 
}


\book
{

  \header
  {
    tagline = ##f %Do not display tagline
  }

  \score
  {
    <<

      \override Score.BarNumber.break-visibility = ##(#f #f #f) %The order of the three values is end of line visible, middle of line visible, beginning of line visible.
     
     
      
     
      \new Staff \with 
      {
        \omit TimeSignature
        %\omit BarLine
        \omit Clef
        \omit KeySignature
        \override StaffSymbol.thickness = #1 %thickness of stafflines, ledger lines, and stems
        % \accidentalStyle dodecaphonic  modern modern-cautionary neo-modern default http://lilypond.org/doc/v2.18/Documentation/notation/displaying-pitches#automatic-accidentals
      }

      {
        \override TupletBracket.bracket-visibility = ##t
        \override TupletBracket.padding = 3
        \override TupletNumber.visibility = ##f
        \set tupletFullLength = ##t %http://lilypond.org/doc/v2.19/Documentation/snippets/rhythms
        \override NoteHead.font-size = #-2
        \override DynamicText.font-size = #-2
        \override Stem.details.beamed-lengths = #'(7)
        \override Stem.details.lengths = #'(7)
        % \override NoteColumn.accent-skip = ##t
        \override Accidental.font-size = -2 
        \override Stem.direction = #up
        %\stopStaff % Hides staff lines
        \set Score.tempoHideNote = ##t
        %\override Stem.transparent = ##t 
        \override Score.Script.font-size = #-2 %change articulation font size
        
        
        %%%%%%% SCORE BEGINS HERE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        
        %Grace notes into attack
        %Attacked grace notes
        %Alternate with long tones and silence
        %position post grace in inkscape
        
        
        
        \tempo 4 = 60
        \time 49/4
        
        %Make a 0.5 - 5 version for before and after
        
        
       
        %3 beats After
        \once \override Stem.direction = #down

       % \once \override Dots.dot-count = #0
        \afterGrace  

        e''2. -^ 
        { 
          \override NoteHead.font-size = #-8
          [ e''32    <d'' f''>  <d'' f''>  <c'' e'' g''> <c'' e'' g''>  <b' d'' f'' a''>  <b' d'' f'' a''>  <b' d'' f'' a''>  <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <g' b' d'' f'' a'' c'''>  <g' b' d'' f'' a'' c'''>    <g' b' d'' f'' a'' c'''>   <f' a' c'' e'' g'' b'' d'''>    <f' a' c'' e'' g'' b'' d'''>  <e' g' b' d'' f'' a'' c''' e'''>   <e' g' b' d'' f'' a'' c''' e'''>   <d' f' a' c'' e'' g'' b'' d''' f'''>       <d' f' a' c'' e'' g'' b'' d''' f'''> <c' e' g' b' d'' f'' a'' c''' e''' g'''>   <c' e' g' b' d'' f'' a'' c''' e''' g'''>    <b d' f' a' c'' e'' g'' b'' d''' f''' a'''>   <b d' f' a' c'' e'' g'' b'' d''' f''' a'''>         <a c' e' g' b' d'' f'' a'' c''' e''' g''' b'''>            <b d' f' a' c'' e'' g'' b'' d''' f''' a'''>  <b d' f' a' c'' e'' g'' b'' d''' f''' a'''>  <c' e' g' b' d'' f'' a'' c''' e''' g'''>     <c' e' g' b' d'' f'' a'' c''' e''' g'''>    <d' f' a' c'' e'' g'' b'' d''' f'''>     <d' f' a' c'' e'' g'' b'' d''' f'''>   <e' g' b' d'' f'' a'' c''' e'''>    <e' g' b' d'' f'' a'' c''' e'''>   <f' a' c'' e'' g'' b'' d'''>       <f' a' c'' e'' g'' b'' d'''>   <g' b' d'' f'' a'' c'''>   <g' b' d'' f'' a'' c'''>   <g' b' d'' f'' a'' c'''>    <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <b' d'' f'' a''>  <b' d'' f'' a''>  <b' d'' f'' a''>   <c'' e'' g''>    <c'' e'' g''>    <d'' f''>   <d'' f''>   e''  ]
        }
        \override NoteHead.font-size = #-2
        e''4
       
        
       
        %1/2After
        \once \override Stem.direction = #down
        \afterGrace  
        e''2 -^
        { 
          \override NoteHead.font-size = #-8
          [ e''32   <d'' f''> <d'' f''>  <c'' e'' g''><c'' e'' g''>  <b' d'' f'' a''>  <b' d'' f'' a''>  <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <g' b' d'' f'' a'' c'''>   <f' a' c'' e'' g'' b'' d'''>  <e' g' b' d'' f'' a'' c''' e'''> <d' f' a' c'' e'' g'' b'' d''' f'''>  <c' e' g' b' d'' f'' a'' c''' e''' g'''>   <b d' f' a' c'' e'' g'' b'' d''' f''' a'''>        <a c' e' g' b' d'' f'' a'' c''' e''' g''' b'''>        <b d' f' a' c'' e'' g'' b'' d''' f''' a'''>  <c' e' g' b' d'' f'' a'' c''' e''' g'''>    <d' f' a' c'' e'' g'' b'' d''' f'''>   <e' g' b' d'' f'' a'' c''' e'''> <f' a' c'' e'' g'' b'' d'''>  <g' b' d'' f'' a'' c'''>    <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <b' d'' f'' a''>  <b' d'' f'' a''>   <c'' e'' g''>    <c'' e'' g''>  <d'' f''>  <d'' f''>   e''  ]
        }
        \override NoteHead.font-size = #-2
        e''4
       
       
        %1/4 After
        \once \override Stem.direction = #down

        \afterGrace  
        e''4 -^
        { 
          \override NoteHead.font-size = #-8
          [ e''32   <d'' f''>  <c'' e'' g''> <b' d'' f'' a''>   <a' c'' e'' g'' b''>  <g' b' d'' f'' a'' c'''>   <f' a' c'' e'' g'' b'' d'''>  <e' g' b' d'' f'' a'' c''' e'''> <f' a' c'' e'' g'' b'' d'''>  <g' b' d'' f'' a'' c'''>  <a' c'' e'' g'' b''> <b' d'' f'' a''>   <c'' e'' g''>  <d'' f''>   e''  ]
        }
        \override NoteHead.font-size = #-2
        e''4
       

       
        %1/8 After
        \once \override Stem.direction = #down

        \afterGrace  
        e''8 -^
        { 
          \override NoteHead.font-size = #-8
          [ e''32    <d'' f''>  <c'' e'' g''> <b' d'' f'' a''>  <c'' e'' g''>  <d'' f''>   e''  ]
        }
        \override NoteHead.font-size = #-2
        e''8 
        
       
       
       
        %1/8 before
        r8 e''8
        
        \grace  {  
          \override NoteHead.font-size = #-8
          [ e''32  <d'' f''>  <c'' e'' g''>   <b' d'' f'' a''>    <a' c'' e'' g'' b''>      <b' d'' f'' a''>    <c'' e'' g''>   <d'' f''>   e''   ] 
        }
        \override NoteHead.font-size = #-2
        \once \override Stem.direction = #down
        e''8 -^  r8 
        
        %1/4 before
        e''4
        
        \grace  {  
          \override NoteHead.font-size = #-8
          [ e''32 <d'' f''>   <c'' e'' g''>   <b' d'' f'' a''>    <a' c'' e'' g'' b''>  <g' b' d'' f'' a'' c''' >       <f' a' c'' e'' g'' b'' d'''>    <e' g' b' d'' f'' a'' c''' e''' >    <d' f' a' c'' e'' g'' b'' d''' f'''>   <c' e' g' b' d'' f'' a'' c''' e''' g''' >     <d' f' a' c'' e'' g'' b'' d''' f'''>    <e' g' b' d'' f'' a'' c''' e''' >   <f' a' c'' e'' g'' b'' d'''>       <g' b' d'' f'' a'' c''' >  <a' c'' e'' g'' b''>  <b' d'' f'' a''>  <c'' e'' g''>   <d'' f''>  e''   ] 
        }
        \override NoteHead.font-size = #-2
        \once \override Stem.direction = #down
        e''8 -^  r8
        
        %2/4 before
        e''2
        
        \grace  {  
          \override NoteHead.font-size = #-8
          [ e''32 <d'' f''>  <d'' f''>  <d'' f''>  <d'' f''>  <c'' e'' g''>  <c'' e'' g''>   <c'' e'' g''>  <c'' e'' g''>   <b' d'' f'' a''>  <b' d'' f'' a''>  <b' d'' f'' a''>  <b' d'' f'' a''>  <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <g' b' d'' f'' a'' c''' >   <g' b' d'' f'' a'' c''' >  <g' b' d'' f'' a'' c''' >    <f' a' c'' e'' g'' b'' d'''> <f' a' c'' e'' g'' b'' d'''>  <e' g' b' d'' f'' a'' c''' e''' > <e' g' b' d'' f'' a'' c''' e''' >        <d' f' a' c'' e'' g'' b'' d''' f'''>          <e' g' b' d'' f'' a'' c''' e''' >  <e' g' b' d'' f'' a'' c''' e''' >      <f' a' c'' e'' g'' b'' d'''>  <f' a' c'' e'' g'' b'' d'''>    <g' b' d'' f'' a'' c''' >     <g' b' d'' f'' a'' c''' > <g' b' d'' f'' a'' c''' >  <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''> <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <b' d'' f'' a''>  <b' d'' f'' a''> <b' d'' f'' a''>  <b' d'' f'' a''>  <c'' e'' g''>  <c'' e'' g''> <c'' e'' g''>  <c'' e'' g''>  <d'' f''>  <d'' f''> <d'' f''>  <d'' f''>  e''   ]
        }
        \override NoteHead.font-size = #-2
        \once \override Stem.direction = #down
        e''8 -^  r8
        
        %3/4 before
        e''2.
        
        \grace  {  
          \override NoteHead.font-size = #-8
          [ e''32 <d'' f''>  <d'' f''>  <d'' f''>  <d'' f''>  <c'' e'' g''>  <c'' e'' g''>   <c'' e'' g''>  <c'' e'' g''>   <b' d'' f'' a''>  <b' d'' f'' a''>  <b' d'' f'' a''>  <b' d'' f'' a''>  <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <g' b' d'' f'' a'' c''' >   <g' b' d'' f'' a'' c''' >  <g' b' d'' f'' a'' c''' > <g' b' d'' f'' a'' c''' >      <f' a' c'' e'' g'' b'' d'''> <f' a' c'' e'' g'' b'' d'''>   <f' a' c'' e'' g'' b'' d'''> <f' a' c'' e'' g'' b'' d'''>   <e' g' b' d'' f'' a'' c''' e''' > <e' g' b' d'' f'' a'' c''' e''' >   <e' g' b' d'' f'' a'' c''' e''' > <e' g' b' d'' f'' a'' c''' e''' >    <d' f' a' c'' e'' g'' b'' d''' f'''>  <d' f' a' c'' e'' g'' b'' d''' f'''>   <d' f' a' c'' e'' g'' b'' d''' f'''>        < c' e' g' b' d'' f'' a'' c''' e''' g'''>     < c' e' g' b' d'' f'' a'' c''' e''' g'''>        <b d' f' a' c'' e'' g'' b'' d''' f''' a'''> <b d' f' a' c'' e'' g'' b'' d''' f''' a'''>      <a c' e' g' b' d'' f'' a'' c''' e''' g''' b'''>              <g b d' f' a' c'' e'' g'' b'' d''' f''' a''' c''''>            <a c' e' g' b' d'' f'' a'' c''' e''' g''' b'''>       <b d' f' a' c'' e'' g'' b'' d''' f''' a'''> <b d' f' a' c'' e'' g'' b'' d''' f''' a'''>   < c' e' g' b' d'' f'' a'' c''' e''' g'''>     < c' e' g' b' d'' f'' a'' c''' e''' g'''>        <d' f' a' c'' e'' g'' b'' d''' f'''>  <d' f' a' c'' e'' g'' b'' d''' f'''>   <d' f' a' c'' e'' g'' b'' d''' f'''>    <e' g' b' d'' f'' a'' c''' e''' >  <e' g' b' d'' f'' a'' c''' e''' ><e' g' b' d'' f'' a'' c''' e''' > <e' g' b' d'' f'' a'' c''' e''' >        <f' a' c'' e'' g'' b'' d'''>  <f' a' c'' e'' g'' b'' d'''>   <f' a' c'' e'' g'' b'' d'''> <f' a' c'' e'' g'' b'' d'''>    <g' b' d'' f'' a'' c''' >     <g' b' d'' f'' a'' c''' >  <g' b' d'' f'' a'' c''' >  <g' b' d'' f'' a'' c''' >   <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''> <a' c'' e'' g'' b''>  <a' c'' e'' g'' b''>  <b' d'' f'' a''>  <b' d'' f'' a''> <b' d'' f'' a''>  <b' d'' f'' a''>  <c'' e'' g''>  <c'' e'' g''> <c'' e'' g''>  <c'' e'' g''>  <d'' f''>  <d'' f''> <d'' f''>  <d'' f''>  e''   ]
        } 
        \override NoteHead.font-size = #-2
        \once \override Stem.direction = #down
        e''8 -^  r8
        
        
        
        
        
        \hideNotes r8 \unHideNotes

        \once \override Stem.direction = #down
       
        \afterGrace  
        e''8 -^
        { 
          \override NoteHead.font-size = #-8
          [ e''32    <f'' d''> <g'' c''> <a'' e'' b'>  <g'' c''>  <f'' d''> e''  ]
        }
        \override NoteHead.font-size = #-2
        \hideNotes r8 \unHideNotes
        
        b'4~
        
        \once \override TupletNumber #'text = "5:2"
        \tuplet 5/4 {b'8 r8 r b'4~}
        
        b'4
        
        \once \override Stem.direction = #down
        \afterGrace 1/99
        e''4 -^
        { 
          \override NoteHead.font-size = #-8
          [ e''32  e'' e'' e'' e'' e'' e'' e'' <f'' d''> <g'' c''> <b' d'' f'' a''>  <a' c'' g'' b''>  <g' b' e'' a'' c''' >  <a' c'' g'' b''>  <b' d'' f'' a''>  <g'' c''>  <f'' d''> e''  ]
        }
        \override NoteHead.font-size = #-2
        % \hideNotes r8 \unHideNotes
        
        r4 r r r r r
        
        \grace  {  
          \override NoteHead.font-size = #-8
          [ e''32    <f'' d''> <g'' c''> <b' d'' f'' a''>  <a' c'' g'' b''>  <g' b' e'' a'' c''' >  <a' c'' g'' b''>  <b' d'' f'' a''>  <g'' c''>  <f'' d''> e''  ]
        }
        \override NoteHead.font-size = #-2
        \once \override Stem.direction = #down
        e''8 -^  
        \hideNotes r8 \unHideNotes
        
        
        
        
      
        
        
        
        
        
        
        
       
        %extra note for right border in Inkscape/SVG
        \once \override Stem.direction = #down
        g''4 

        %%%%% END SCORE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        
        
        
        
      }

    >>


    \layout
    {
      \context
      {
        \Score
        proportionalNotationDuration = #(ly:make-moment 1/35) 
        \override SpacingSpanner.uniform-stretching = ##t
        \override SpacingSpanner.strict-note-spacing = ##t
        % \override SpacingSpanner.strict-grace-spacing = ##t
        \override Beam.breakable = ##t
        \override Glissando.breakable = ##t
        \override TextSpanner.breakable = ##t
        % \override NoteHead.no-ledgers = ##t 
      }

      indent = 0
      line-width = 2150 %50px per beat +1 for last beat marking border
      #(layout-set-staff-size 33) %staff height
      % \hide Stem
      %\hide NoteHead
      % \hide LedgerLineSpanner
      % \hide TupletNumber 
    }

    \midi{}

  }
}

