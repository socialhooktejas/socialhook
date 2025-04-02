declare module 'react-native-vector-icons/MaterialIcons' {
  import { ComponentClass } from 'react';
  import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle | ImageStyle;
  }

  const MaterialIcons: ComponentClass<IconProps>;
  export default MaterialIcons;
}

declare module 'react-native-vector-icons/FontAwesome' {
  import { ComponentClass } from 'react';
  import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle | ImageStyle;
  }

  const FontAwesome: ComponentClass<IconProps>;
  export default FontAwesome;
}

declare module 'react-native-vector-icons/Ionicons' {
  import { ComponentClass } from 'react';
  import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle | ImageStyle;
  }

  const Ionicons: ComponentClass<IconProps>;
  export default Ionicons;
} 