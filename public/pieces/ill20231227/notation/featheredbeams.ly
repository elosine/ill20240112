\version "2.20.0"
%All notation in one line
%Make sure whatever last note has an extra note for full duration
%meter will have extra beat
%paper width and line width will be number of beats (+extra beat) * 50
%Resize in Inkscape to 50px per beat - minus the extra beat
%zoom 210% should be 105 px per beat


\paper
{
  paper-width = 1800 %50px per beat +1 for last beat marking border 
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
        \omit BarLine
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
        \override NoteHead.font-size = #-4
        \override DynamicText.font-size = #-2
        \override Stem.details.beamed-lengths = #'(7)
        \override Stem.details.lengths = #'(7)
        % \override NoteColumn.accent-skip = ##t
        \override Accidental.font-size = -2 
        \override Stem.direction = #up
        \stopStaff % Hides staff lines
        \set Score.tempoHideNote = ##t
        %\override Stem.transparent = ##t 
        \override Score.Script.font-size = #-2 %change articulation font size
        
        
        %%%%%%% SCORE BEGINS HERE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        \tempo 4 = 60
        \time 36/4
        
        
       % Given the current implementation, it would be necessary to use an approximate rational like 50/63 as the moment in order to get 'f' to be half of 'c'. Why that number? Well, it's a close approximation to the irrational cube root of one half. We determine this exact value by taking the desired ratio (1/2) and raising it to the reciprocal of the number of scaling steps between the first and last notes (three, in this case, which becomes the fraction 1/3). (1/2)^(1/3) is about 0.7937; and 50/63 is roughly 0.79365.
        
        
        \override Beam.grow-direction = #RIGHT
        \featherDurations #(ly:make-moment 4/5) { e'32 [ e' e' e' e' e' e' e' e' e' e' e'  ] } %3 beats accel
       %4/5
       
       
       
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
      line-width = 1800 %50px per beat +1 for last beat marking border
      #(layout-set-staff-size 33) %staff height
      % \hide Stem
      %\hide NoteHead
      % \hide LedgerLineSpanner
      % \hide TupletNumber 
    }

    \midi{}

  }
}

